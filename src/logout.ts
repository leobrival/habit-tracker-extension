import { showToast, Toast } from "@raycast/api";
import { authService } from "./auth-service";

export default async function Logout() {
  try {
    await authService.initialize();

    if (!authService.isAuthenticated()) {
      showToast(Toast.Style.Failure, "Not logged in");
      return;
    }

    await authService.logout();
    showToast(Toast.Style.Success, "Logout successful!");
  } catch (error) {
    showToast(Toast.Style.Failure, "Logout failed", "An error occurred during logout");
  }
}
