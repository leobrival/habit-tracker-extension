import { closeMainWindow, showToast, Toast } from "@raycast/api";
import { authService } from "./auth-service";

export async function handleLogout() {
  try {
    await authService.initialize();

    if (!authService.isAuthenticated()) {
      showToast(Toast.Style.Failure, "Not logged in");
      return;
    }

    await authService.logout();
    showToast(Toast.Style.Success, "Logout successful!");

    // Close the main window to refresh the state
    await closeMainWindow();
  } catch (error) {
    showToast(Toast.Style.Failure, "Logout failed", "An error occurred during logout");
  }
}
