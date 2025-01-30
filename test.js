const shell = require("shelljs");
const adb = require("./api");

// Mock shelljs exec
jest.mock("shelljs", () => ({
  exec: jest.fn(),
}));

describe("ADB API", () => {
  const mockDeviceId = "test_device_123";
  const mockPackage = "com.example.app";

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("launchApp", () => {
    it("should execute monkey command with correct parameters", () => {
      adb.launchApp(mockPackage, mockDeviceId);
      expect(shell.exec).toHaveBeenCalledWith(
        `adb -s ${mockDeviceId} shell monkey -p ${mockPackage} -c android.intent.category.LAUNCHER 1`
      );
      expect(shell.exec).toHaveBeenCalledTimes(1);
    });
  });

  describe("getListOfDevices", () => {
    beforeEach(() => {
      shell.exec.mockReturnValue({
        stdout: `List of devices attached
${mockDeviceId} device
emulator-5554 device
daemon not running
daemon started successfully`,
      });
    });

    it("should parse and return connected devices", () => {
      const devices = adb.getListOfDevices();
      expect(devices).toHaveLength(2);
      expect(devices).toContain(mockDeviceId);
      expect(devices).toContain("emulator-5554");
    });

    it("should filter out daemon messages", () => {
      const devices = adb.getListOfDevices();
      expect(devices).not.toContain("daemon not running");
      expect(devices).not.toContain("daemon started successfully");
    });
  });

  describe("getPackagesByDeviceSerialNumber", () => {
    beforeEach(() => {
      shell.exec.mockReturnValue({
        stdout: `package:com.example.app
package:com.android.chrome
package:com.google.android.gms`,
      });
    });

    it("should return list of packages without package: prefix", () => {
      const packages = adb.getPackagesByDeviceSerialNumber(mockDeviceId);
      expect(packages).toHaveLength(3);
      expect(packages).toContain("com.example.app");
      expect(packages).toContain("com.android.chrome");
      expect(packages).toContain("com.google.android.gms");
    });
  });

  describe("getDeviceApkPath", () => {
    beforeEach(() => {
      shell.exec.mockReturnValue({
        stdout: `package:/data/app/com.example.app-1/base.apk=com.example.app
package:/data/app/com.android.chrome-2/base.apk=com.android.chrome`,
      });
    });

    it("should return correct APK path for package", () => {
      const path = adb.getDeviceApkPath(mockDeviceId, mockPackage);
      expect(path).toBe("/data/app/com.example.app-1/base.apk");
    });

    it("should return undefined for non-existent package", () => {
      const path = adb.getDeviceApkPath(mockDeviceId, "non.existent.package");
      expect(path).toBeUndefined();
    });
  });

  describe("downloadAPK", () => {
    beforeEach(() => {
      shell.exec.mockReturnValueOnce({
        stdout: "package:/data/app/com.example.app-1/base.apk=com.example.app",
      });
    });

    it("should pull APK file with correct path", () => {
      const fileName = adb.downloadAPK(mockDeviceId, mockPackage);
      expect(fileName).toBe("com.example.app.apk");
      expect(shell.exec).toHaveBeenCalledWith(
        `adb -s ${mockDeviceId} pull /data/app/com.example.app-1/base.apk ${fileName}`,
        { silent: true }
      );
    });
  });

  describe("fuzzySearchPackages", () => {
    beforeEach(() => {
      // Mock the package list for initialization
      shell.exec.mockReturnValue({
        stdout: `package:com.example.app
package:com.android.chrome
package:com.google.android.gms`,
      });
      // Initialize mPackages
      adb.getPackagesByDeviceSerialNumber(mockDeviceId);
    });

    it("should return matching packages", async () => {
      const results = await adb.fuzzySearchPackages(null, "chrome");
      expect(results).toContain("com.android.chrome");
    });

    it("should handle empty search string", async () => {
      const results = await adb.fuzzySearchPackages(null, "");
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("uninstall", () => {
    it("should execute uninstall command with correct parameters", () => {
      adb.uninstall(mockPackage, mockDeviceId);
      expect(shell.exec).toHaveBeenCalledWith(
        `adb -s ${mockDeviceId} uninstall ${mockPackage}`
      );
    });
  });

  describe("clearData", () => {
    it("should execute clear command with correct parameters", () => {
      adb.clearData(mockPackage, mockDeviceId);
      expect(shell.exec).toHaveBeenCalledWith(
        `adb -s ${mockDeviceId} shell pm clear ${mockPackage}`
      );
    });
  });

  describe("forceKill", () => {
    it("should execute force-stop command with correct parameters", () => {
      adb.forceKill(mockPackage, mockDeviceId);
      expect(shell.exec).toHaveBeenCalledWith(
        `adb -s ${mockDeviceId} shell am force-stop ${mockPackage}`
      );
      expect(shell.exec).toHaveBeenCalledTimes(1);
    });

    it("should handle package names with special characters", () => {
      const specialPackage = "com.example.app.with.dots";
      adb.forceKill(specialPackage, mockDeviceId);
      expect(shell.exec).toHaveBeenCalledWith(
        `adb -s ${mockDeviceId} shell am force-stop ${specialPackage}`
      );
    });
  });

  describe("isAnyDeviceConnected", () => {
    it("should return true when packages are found", () => {
      shell.exec.mockReturnValue({ stdout: "package:com.example.app\n" });
      expect(adb.isAnyDeviceConnected(mockDeviceId)).toBe(true);
    });

    it("should return false when no packages are found", () => {
      shell.exec.mockReturnValue({ stdout: "" });
      expect(adb.isAnyDeviceConnected(mockDeviceId)).toBe(false);
    });
  });

  describe("integration tests", () => {
    beforeEach(() => {
      shell.exec.mockReturnValue({ stdout: "package:com.example.app\n" });
    });

    it("should be able to launch app after getting package list", () => {
      const packages = adb.getPackagesByDeviceSerialNumber(mockDeviceId);
      expect(packages).toContain("com.example.app");

      adb.launchApp(mockPackage, mockDeviceId);
      expect(shell.exec).toHaveBeenCalledWith(
        `adb -s ${mockDeviceId} shell monkey -p ${mockPackage} -c android.intent.category.LAUNCHER 1`
      );
    });

    it("should be able to chain multiple operations", () => {
      // Check device connection
      const isConnected = adb.isAnyDeviceConnected(mockDeviceId);
      expect(isConnected).toBe(true);

      // Clear app data
      adb.clearData(mockPackage, mockDeviceId);

      // Launch app
      adb.launchApp(mockPackage, mockDeviceId);

      // Force kill app
      adb.forceKill(mockPackage, mockDeviceId);

      // Verify all commands were called in sequence
      expect(shell.exec).toHaveBeenCalledTimes(4);
    });
  });
});
