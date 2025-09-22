import { Action, ActionPanel, Icon, List, showToast, Toast, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import Auth from "./auth";
import { authService } from "./auth-service";
import { handleLogout } from "./logout-action";
import { ApiError, Board, User } from "./types";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const { push } = useNavigation();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      await authService.initialize();

      if (!authService.isAuthenticated()) {
        showToast(Toast.Style.Failure, "Please login first");
        return;
      }

      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      await loadBoards();
    } catch (error) {
      showToast(Toast.Style.Failure, "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const loadBoards = async () => {
    try {
      const boardsData = await authService.apiRequest<Board[]>("/boards");
      setBoards(boardsData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        showToast(Toast.Style.Failure, "Please login first");
      } else {
        showToast(Toast.Style.Failure, "Failed to load boards");
      }
    }
  };

  const createBoard = async (name: string, description: string) => {
    try {
      const newBoard = await authService.apiRequest<Board>("/boards", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      });

      setBoards((prev) => [...prev, newBoard]);
      showToast(Toast.Style.Success, "Board created successfully!");
    } catch (error) {
      showToast(Toast.Style.Failure, "Failed to create board");
    }
  };

  if (!authService.isAuthenticated()) {
    return (
      <List>
        <List.EmptyView
          title="Not Authenticated"
          description="Please login to access your dashboard"
          actions={
            <ActionPanel>
              <Action.Push title="Login" target={<Auth />} icon={Icon.Person} />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List isLoading={isLoading}>
      <List.Section title="Profile">
        {user && (
          <List.Item
            title={user.fullName}
            subtitle={user.email}
            icon={Icon.Person}
            accessories={[{ text: `Member since ${new Date(user.createdAt).toLocaleDateString()}` }]}
          />
        )}
      </List.Section>

      <List.Section title="Habit Boards">
        {boards.length === 0 ? (
          <List.EmptyView
            title="No Boards Yet"
            description="Create your first habit tracking board"
            actions={
              <ActionPanel>
                <Action.Push
                  title="Create Board"
                  target={<CreateBoardForm onSubmit={createBoard} />}
                  icon={Icon.Plus}
                />
                <ActionPanel.Section title="Account">
                  <Action
                    title="Logout"
                    onAction={handleLogout}
                    icon={Icon.Logout}
                    style={Action.Style.Destructive}
                    shortcut={{ modifiers: ["cmd"], key: "q" }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ) : (
          boards.map((board) => (
            <List.Item
              key={board.id}
              title={board.name}
              subtitle={board.description}
              icon={Icon.List}
              accessories={[{ text: `${board.checkIns?.length || 0} check-ins` }]}
              actions={
                <ActionPanel>
                  <Action.Push title="View Board Details" target={<BoardDetails board={board} />} icon={Icon.Eye} />
                  <Action.Push
                    title="Create Board"
                    target={<CreateBoardForm onSubmit={createBoard} />}
                    icon={Icon.Plus}
                  />
                  <ActionPanel.Section title="Account">
                    <Action
                      title="Logout"
                      onAction={handleLogout}
                      icon={Icon.Logout}
                      style={Action.Style.Destructive}
                      shortcut={{ modifiers: ["cmd"], key: "q" }}
                    />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          ))
        )}
      </List.Section>
    </List>
  );
}

// Create Board Form Component
interface CreateBoardFormProps {
  onSubmit: (name: string, description: string) => Promise<void>;
}

function CreateBoardForm({ onSubmit }: CreateBoardFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { pop } = useNavigation();

  const handleSubmit = async (values: { name: string; description: string }) => {
    if (!values.name.trim()) {
      showToast(Toast.Style.Failure, "Board name is required");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(values.name.trim(), values.description.trim());
      pop();
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Board" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Board Name" placeholder="e.g., Morning Routine, Exercise Habits" />
      <Form.TextArea id="description" title="Description" placeholder="Describe what this board is for..." />
    </Form>
  );
}

// Board Details Component
interface BoardDetailsProps {
  board: Board;
}

function BoardDetails({ board }: BoardDetailsProps) {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = async () => {
    try {
      const checkInsData = await authService.apiRequest<any[]>(`/check-ins?boardId=${board.id}`);
      setCheckIns(checkInsData);
    } catch (error) {
      showToast(Toast.Style.Failure, "Failed to load check-ins");
    } finally {
      setIsLoading(false);
    }
  };

  const addCheckIn = async () => {
    try {
      const newCheckIn = await authService.apiRequest<any>("/check-ins", {
        method: "POST",
        body: JSON.stringify({
          boardId: board.id,
          checkDate: new Date().toISOString(),
          completed: true,
          notes: "",
        }),
      });

      setCheckIns((prev) => [...prev, newCheckIn]);
      showToast(Toast.Style.Success, "Check-in added!");
    } catch (error) {
      showToast(Toast.Style.Failure, "Failed to add check-in");
    }
  };

  return (
    <List isLoading={isLoading}>
      <List.Section title={`${board.name} - Check-ins`}>
        {checkIns.length === 0 ? (
          <List.EmptyView
            title="No Check-ins Yet"
            description="Start tracking your progress"
            actions={
              <ActionPanel>
                <Action title="Add Check-In" onAction={addCheckIn} icon={Icon.Plus} />
              </ActionPanel>
            }
          />
        ) : (
          checkIns.map((checkIn, index) => (
            <List.Item
              key={checkIn.id || index}
              title={new Date(checkIn.checkDate).toLocaleDateString()}
              subtitle={checkIn.notes || "No notes"}
              icon={checkIn.completed ? Icon.CheckCircle : Icon.Circle}
              accessories={[{ text: checkIn.completed ? "Completed" : "Incomplete" }]}
              actions={
                <ActionPanel>
                  <Action title="Add Check-In" onAction={addCheckIn} icon={Icon.Plus} />
                </ActionPanel>
              }
            />
          ))
        )}
      </List.Section>
    </List>
  );
}

// Import Form component
import { Form } from "@raycast/api";
