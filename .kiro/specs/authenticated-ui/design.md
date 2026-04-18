# Authenticated UI Design

## Overview

The authenticated UI is the core workspace interface for CodeCollab where users code, collaborate, and manage projects. This design builds upon the existing workspace layout implementation and extends it with a full-featured code editor, real-time collaboration features, and comprehensive project management capabilities.

The implementation is divided into four phases:
1. Workspace layout and project management (partially implemented)
2. Code editor interface with Monaco editor, file tree, and terminal
3. Real-time collaboration features with live cursors and chat
4. Settings and profile management

This design follows the CodeCollab design system: dark theme (black background), blue accent (#3b82f6), sharp corners (no border-radius), Inter font for UI, and JetBrains Mono for code.

## Architecture

### Component Hierarchy

```
WorkspaceLayout (already implemented)
├── TopNavigationBar
│   ├── Logo & Workspace Switcher
│   ├── Global Search
│   ├── Notifications
│   └── User Menu
├── MainContent
│   ├── Sidebar (already implemented)
│   │   ├── New Project Button
│   │   ├── Navigation Links
│   │   ├── Teams Section
│   │   └── Storage Widget
│   └── ContentArea
│       ├── ProjectDashboard (already implemented)
│       │   ├── Header with View Toggle
│       │   ├── Quick Start Templates
│       │   └── Project Grid/List
│       └── EditorWorkspace (new)
│           ├── FileTree
│           ├── EditorTabs
│           ├── MonacoEditor
│           ├── TerminalPanel
│           └── CollaborationSidebar
```

### State Management

- **Local State**: Component-level state for UI interactions (view toggles, sidebar collapse, tab management)
- **Context API**: Workspace context for current project, active file, editor settings
- **Real-time State**: WebSocket connection for collaboration features (cursors, presence, chat)
- **Server State**: React Query for project data, file contents, user settings

### Data Flow

1. **Project Loading**: User selects project → Fetch project metadata → Load file tree → Open last active file
2. **File Editing**: User opens file → Load file content → Initialize Monaco editor → Sync changes via WebSocket
3. **Collaboration**: User joins project → Establish WebSocket connection → Broadcast cursor position → Receive collaborator updates
4. **Terminal**: User opens terminal → Create terminal session → Stream I/O via WebSocket

## Components and Interfaces

### Phase 1: Workspace Layout & Project Management (Partially Implemented)

#### WorkspaceLayout Component
**Status**: Implemented at `frontend/app/(workspace)/layout.tsx`

**Current Implementation**:
- Top navigation bar with logo, workspace switcher, search, notifications, user menu
- Full-screen layout with flex structure
- Renders children in main content area

**Enhancements Needed**:
- Make workspace switcher functional (dropdown with workspace list)
- Implement search modal (⌘K shortcut)
- Add notifications dropdown
- Add user menu dropdown with profile, settings, sign out

#### Sidebar Component
**Status**: Implemented within `frontend/app/(workspace)/workspace/page.tsx`

**Current Implementation**:
- New Project button
- Navigation links (All Projects, Recent, Shared, Starred)
- Teams section
- Storage widget

**Enhancements Needed**:
- Extract sidebar into reusable component
- Add collapsible functionality
- Add active state management
- Add keyboard shortcuts

#### ProjectDashboard Component
**Status**: Implemented at `frontend/app/(workspace)/workspace/page.tsx`

**Current Implementation**:
- Grid/list view toggle
- Quick start templates
- Project cards with metadata
- Sort dropdown

**Enhancements Needed**:
- Connect to real project data API
- Add project creation modal
- Add project settings modal
- Add project sharing functionality
- Add project deletion with confirmation
- Add project search/filter

### Phase 2: Code Editor Interface

#### EditorWorkspace Component
**Location**: `frontend/app/(workspace)/editor/[projectId]/page.tsx`

**Props**:
```typescript
interface EditorWorkspaceProps {
  projectId: string;
}
```

**State**:
```typescript
interface EditorState {
  fileTree: FileNode[];
  openTabs: EditorTab[];
  activeTabId: string | null;
  terminalOpen: boolean;
  terminalHeight: number;
  sidebarWidth: number;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

interface EditorTab {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  isDirty: boolean;
  content: string;
}
```

**Layout**:
- Three-column layout: FileTree (resizable) | Editor | CollaborationSidebar (collapsible)
- Bottom panel: Terminal (resizable, collapsible)
- Top: Tab bar with open files

#### FileTree Component
**Location**: `frontend/components/FileTree.tsx`

**Props**:
```typescript
interface FileTreeProps {
  projectId: string;
  files: FileNode[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (parentId: string, type: 'file' | 'folder') => void;
  onFileRename: (fileId: string, newName: string) => void;
  onFileDelete: (fileId: string) => void;
}
```

**Features**:
- Recursive tree rendering
- Expand/collapse folders
- Right-click context menu (New File, New Folder, Rename, Delete)
- Drag and drop file organization
- File icons based on extension
- Search/filter files

#### MonacoEditor Component
**Location**: `frontend/components/MonacoEditor.tsx`

**Props**:
```typescript
interface MonacoEditorProps {
  fileId: string;
  content: string;
  language: string;
  onChange: (content: string) => void;
  onSave: () => void;
  collaborators: Collaborator[];
  readOnly?: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursorPosition: { line: number; column: number };
  selection?: { start: Position; end: Position };
}
```

**Features**:
- Monaco editor integration (@monaco-editor/react)
- Syntax highlighting for multiple languages
- Auto-save on change (debounced)
- Manual save with ⌘S
- Collaborative cursors rendering
- Line numbers and minimap
- Code folding
- Find and replace
- IntelliSense and autocomplete

#### EditorTabs Component
**Location**: `frontend/components/EditorTabs.tsx`

**Props**:
```typescript
interface EditorTabsProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabCloseAll: () => void;
  onTabCloseOthers: (tabId: string) => void;
}
```

**Features**:
- Horizontal scrollable tab bar
- Active tab indicator
- Dirty indicator (unsaved changes)
- Close button per tab
- Right-click context menu (Close, Close Others, Close All)
- Drag to reorder tabs

#### Terminal Component
**Location**: `frontend/components/Terminal.tsx`

**Props**:
```typescript
interface TerminalProps {
  projectId: string;
  height: number;
  onResize: (height: number) => void;
  onClose: () => void;
}
```

**Features**:
- xterm.js integration for terminal emulation
- WebSocket connection for I/O streaming
- Multiple terminal sessions (tabs)
- Clear terminal
- Copy/paste support
- Resizable height with drag handle
- Terminal themes matching editor

### Phase 3: Real-time Collaboration Features

#### CollaborationSidebar Component
**Location**: `frontend/components/CollaborationSidebar.tsx`

**Props**:
```typescript
interface CollaborationSidebarProps {
  projectId: string;
  collaborators: CollaboratorPresence[];
  onInvite: () => void;
}

interface CollaboratorPresence {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: 'active' | 'idle' | 'offline';
  currentFile: string | null;
  lastSeen: Date;
}
```

**Features**:
- List of active collaborators
- Presence indicators (active/idle/offline)
- Current file each collaborator is viewing
- Invite button to add collaborators
- Follow collaborator (jump to their cursor)

#### ChatPanel Component
**Location**: `frontend/components/ChatPanel.tsx`

**Props**:
```typescript
interface ChatPanelProps {
  projectId: string;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system';
}
```

**Features**:
- Real-time chat messages
- System notifications (user joined, file edited)
- Message timestamps
- User avatars
- Markdown support in messages
- @mentions
- Emoji picker

#### ShareModal Component
**Location**: `frontend/components/ShareModal.tsx`

**Props**:
```typescript
interface ShareModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectPermission {
  userId: string;
  userName: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
}
```

**Features**:
- Invite by email
- Copy shareable link
- Permission management (owner/editor/viewer)
- Remove collaborators
- Public/private toggle
- Link expiration settings

### Phase 4: Settings & Profile Management

#### SettingsPage Component
**Location**: `frontend/app/(workspace)/settings/page.tsx`

**Sections**:
1. **Profile**: Name, email, avatar, bio
2. **Account**: Password change, 2FA, delete account
3. **Workspace**: Default workspace, workspace name
4. **Editor**: Theme, font size, tab size, keybindings
5. **Billing**: Subscription plan, payment method, invoices
6. **Team**: Team members, roles, invitations
7. **Integrations**: GitHub, GitLab, Slack, Discord

**Layout**:
- Left sidebar with section navigation
- Right content area with forms
- Save button per section
- Toast notifications for success/error

#### ProfilePage Component
**Location**: `frontend/app/(workspace)/profile/page.tsx`

**Features**:
- Public profile view
- Activity feed (recent projects, contributions)
- Statistics (projects created, collaborations, commits)
- Social links
- Public/private toggle

## Data Models

### Project Model
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  language: string;
  template: string | null;
  visibility: 'public' | 'private';
  collaborators: ProjectCollaborator[];
  fileTree: FileNode[];
  settings: ProjectSettings;
}

interface ProjectCollaborator {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
}

interface ProjectSettings {
  defaultBranch: string;
  autoSave: boolean;
  tabSize: number;
  insertSpaces: boolean;
}
```

### File Model
```typescript
interface File {
  id: string;
  projectId: string;
  name: string;
  path: string;
  content: string;
  language: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  lastEditedBy: string;
}
```

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
  settings: UserSettings;
  subscription: Subscription;
}

interface UserSettings {
  theme: 'dark' | 'light';
  editorFontSize: number;
  editorTabSize: number;
  editorInsertSpaces: boolean;
  keybindings: 'default' | 'vim' | 'emacs';
  notifications: NotificationSettings;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  mentions: boolean;
  projectInvites: boolean;
}

interface Subscription {
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodEnd: Date;
}
```

### WebSocket Events
```typescript
// Client → Server
type ClientEvent =
  | { type: 'join_project'; projectId: string }
  | { type: 'leave_project'; projectId: string }
  | { type: 'cursor_move'; fileId: string; position: Position }
  | { type: 'file_change'; fileId: string; changes: TextChange[] }
  | { type: 'chat_message'; content: string }
  | { type: 'terminal_input'; sessionId: string; data: string };

// Server → Client
type ServerEvent =
  | { type: 'user_joined'; user: CollaboratorPresence }
  | { type: 'user_left'; userId: string }
  | { type: 'cursor_update'; userId: string; fileId: string; position: Position }
  | { type: 'file_update'; fileId: string; changes: TextChange[]; userId: string }
  | { type: 'chat_message'; message: ChatMessage }
  | { type: 'terminal_output'; sessionId: string; data: string };

interface Position {
  line: number;
  column: number;
}

interface TextChange {
  range: { start: Position; end: Position };
  text: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Project Display Completeness

*For any* user and their set of accessible projects, the project dashboard should display all projects the user owns or has access to.

**Validates: Requirements 2.1**

### Property 2: View Toggle Idempotence

*For any* project dashboard state, toggling the view mode twice (grid→list→grid or list→grid→list) should return to the original view state.

**Validates: Requirements 2.2**

### Property 3: Project Sorting Correctness

*For any* list of projects and any sort criteria (last modified, name, created date), the resulting project list should be ordered according to the selected criteria.

**Validates: Requirements 2.3**

### Property 4: Project Navigation Consistency

*For any* project card clicked, the system should navigate to the editor workspace URL corresponding to that project's ID.

**Validates: Requirements 2.4**

### Property 5: Template Project Creation

*For any* quick start template selected, the system should create a new project with the file structure and configuration defined by that template.

**Validates: Requirements 2.6**

### Property 6: Search Result Relevance

*For any* search query, all projects in the filtered result list should match the search query in their name, description, or metadata.

**Validates: Requirements 2.7**

### Property 7: File Tree Completeness

*For any* project opened, the file tree should display all files and folders that exist in the project structure.

**Validates: Requirements 3.1**

### Property 8: Folder Expansion Toggle

*For any* folder in the file tree, clicking it twice should return to the original expansion state (expanded→collapsed→expanded or collapsed→expanded→collapsed).

**Validates: Requirements 3.2**

### Property 9: File Opening Consistency

*For any* file in the file tree, clicking it should open that file in the Monaco editor with its content displayed.

**Validates: Requirements 3.3**

### Property 10: File Tree Operation Synchronization

*For any* file or folder operation (create, rename, delete), the system should update both the file tree display and any affected open editor tabs to reflect the change.

**Validates: Requirements 3.5, 3.6, 3.7**

### Property 11: File Tree Drag-and-Drop Validity

*For any* file or folder dragged to a valid drop target (folder or root), the system should reposition the item in the tree structure at the new location.

**Validates: Requirements 3.8**

### Property 12: File Content Display

*For any* file opened, the Monaco editor should display the complete file content with appropriate syntax highlighting based on the file extension.

**Validates: Requirements 4.1, 4.9**

### Property 13: Dirty State Tracking

*For any* edit made to a file, the corresponding tab should be marked as dirty (unsaved changes indicator) until the file is saved.

**Validates: Requirements 4.2**

### Property 14: Save Round-Trip

*For any* file with unsaved changes, saving the file should persist the changes to storage and remove the dirty indicator from the tab.

**Validates: Requirements 4.4**

### Property 15: Tab Management Consistency

*For any* set of open files, each file should have a corresponding tab, and clicking any tab should switch the editor to display that file's content.

**Validates: Requirements 4.5, 4.6**

### Property 16: Unsaved Changes Protection

*For any* tab with unsaved changes (dirty state), attempting to close the tab should trigger a confirmation prompt before closing.

**Validates: Requirements 4.7**

### Property 17: Tab Reordering

*For any* tab dragged to a new position, the tab order should be updated to reflect the new position in the tab bar.

**Validates: Requirements 4.8**

### Property 18: Auto-Save Behavior

*For any* file edit when auto-save is enabled, the system should automatically save the changes after the configured debounce period elapses without further edits.

**Validates: Requirements 4.11**

### Property 19: Terminal Connection Establishment

*For any* terminal opened, the system should establish a WebSocket connection for bidirectional I/O streaming.

**Validates: Requirements 5.2**

### Property 20: Terminal I/O Round-Trip

*For any* input typed in the terminal, the system should send the input to the server via WebSocket and display the resulting output in the terminal.

**Validates: Requirements 5.3**

### Property 21: Terminal Panel Resize Invariant

*For any* terminal panel resize operation, the sum of the terminal height and editor height should remain constant (total available height).

**Validates: Requirements 5.4**

### Property 22: Terminal Session Management

*For any* new terminal session created, the system should add a new terminal tab, and switching between tabs should display the corresponding terminal session.

**Validates: Requirements 5.6, 5.7**

### Property 23: Collaboration Connection Establishment

*For any* user joining a project, the system should establish a WebSocket connection for real-time collaboration updates.

**Validates: Requirements 6.1**

### Property 24: Collaborator Presence Display

*For any* collaborator joining a project, the system should display their presence indicator in the collaboration sidebar with their name, avatar, and status.

**Validates: Requirements 6.2**

### Property 25: Cursor Position Synchronization

*For any* collaborator cursor movement, the system should display their cursor position in the editor with their assigned color.

**Validates: Requirements 6.3**

### Property 26: Selection Highlighting

*For any* collaborator text selection, the system should highlight the selected text range with the collaborator's assigned color.

**Validates: Requirements 6.4**

### Property 27: Real-Time Edit Propagation

*For any* edit made by a collaborator, the system should apply the changes to the local editor in real-time, maintaining document consistency.

**Validates: Requirements 6.5**

### Property 28: Presence Cleanup

*For any* user leaving a project, the system should remove all their presence indicators (cursor, selection, sidebar entry) from other users' views.

**Validates: Requirements 6.6**

### Property 29: Collaborator Status Updates

*For any* collaborator, the system should update their status to "idle" after 5 minutes of inactivity, and to "offline" when their connection is lost.

**Validates: Requirements 6.7, 6.8**

### Property 30: Chat Message Broadcasting

*For any* chat message sent by a user, the system should broadcast the message to all collaborators in the project with timestamp and sender information.

**Validates: Requirements 7.2, 7.3**

### Property 31: Mention Notifications

*For any* chat message containing an @mention of a user, the system should send a notification to the mentioned user.

**Validates: Requirements 7.4**

### Property 32: Markdown Rendering

*For any* chat message containing markdown syntax, the system should render the formatted content in the chat panel.

**Validates: Requirements 7.5**

### Property 33: System Event Messages

*For any* system event (user joined, user left, file edited), the system should display a corresponding system message in the chat panel.

**Validates: Requirements 7.6**

### Property 34: Collaborator List Completeness

*For any* project, opening the share modal should display all current collaborators with their assigned roles.

**Validates: Requirements 8.1**

### Property 35: Invitation Delivery

*For any* valid email address provided for invitation, the system should send an invitation email and add the invitee to the project's pending collaborators.

**Validates: Requirements 8.2, 9.8**

### Property 36: Share Link Uniqueness

*For any* share link generation request, the system should create a unique URL that provides access to the project.

**Validates: Requirements 8.3**

### Property 37: Role-Based Access Control

*For any* collaborator with a specific role (viewer, editor, owner), the system should enforce the permissions associated with that role: viewers have read-only access, editors can modify files, and owners have full control.

**Validates: Requirements 8.4, 8.5, 8.6**

### Property 38: Collaborator Removal

*For any* collaborator removed from a project, the system should revoke their access and disconnect them immediately if they are currently online.

**Validates: Requirements 8.7**

### Property 39: Public Project Access

*For any* project with visibility set to "public", anyone with the share link should be able to view the project without authentication.

**Validates: Requirements 8.8**

### Property 40: Settings Persistence Round-Trip

*For any* user setting updated (profile, editor preferences, workspace configuration), the system should persist the change and reflect it immediately in the UI.

**Validates: Requirements 9.2, 9.5**

### Property 41: Password Update Security

*For any* valid new password provided, the system should validate it against security requirements and update it using secure hashing.

**Validates: Requirements 9.3**

### Property 42: Two-Factor Authentication Enforcement

*For any* user who enables 2FA, the system should require two-factor authentication on their next login attempt.

**Validates: Requirements 9.4**

### Property 43: Keybinding Update Propagation

*For any* keybinding preset selected (default, vim, emacs), the system should update all keyboard shortcuts throughout the application to match the selected preset.

**Validates: Requirements 9.6**

### Property 44: Billing Information Security

*For any* payment method updated, the system should securely store the billing information using encryption and PCI compliance standards.

**Validates: Requirements 9.7**

### Property 45: Integration Connection Persistence

*For any* external integration connected (GitHub, GitLab, Slack), the system should authenticate with the service and persist the connection credentials securely.

**Validates: Requirements 9.9**

### Property 46: Panel Resize Responsiveness

*For any* resizable panel (file tree, terminal), dragging the resize handle should adjust the panel dimensions proportionally to the drag distance.

**Validates: Requirements 10.1, 10.2**

### Property 47: Sidebar Collapse Invariant

*For any* sidebar (left or right) collapsed, the system should hide the sidebar and expand the editor area to occupy the freed space, maintaining total width.

**Validates: Requirements 10.3, 10.4**

### Property 48: Panel Size Persistence Round-Trip

*For any* panel resized, the system should persist the size preference and restore it when the user reopens the workspace.

**Validates: Requirements 10.5, 10.6**


## Error Handling

### Network Errors

**WebSocket Connection Failures**:
- Retry connection with exponential backoff (1s, 2s, 4s, 8s, max 30s)
- Display connection status indicator in UI (connected, reconnecting, disconnected)
- Queue local changes during disconnection and sync when reconnected
- Show toast notification: "Connection lost. Reconnecting..."
- After 5 failed retries, show error modal with manual reconnect button

**API Request Failures**:
- Retry failed requests up to 3 times with exponential backoff
- Display error toast with specific message (e.g., "Failed to save file. Retrying...")
- For critical operations (save, delete), show confirmation modal before retrying
- Log errors to monitoring service (Sentry, LogRocket)
- Provide "Retry" and "Cancel" actions in error notifications

### File System Errors

**File Not Found**:
- Close the tab if file is deleted by another user
- Show toast: "File [filename] was deleted by [user]"
- Remove file from file tree
- Update recent files list

**Permission Denied**:
- Display read-only indicator in editor
- Disable save button and show tooltip: "You don't have permission to edit this file"
- Show role upgrade prompt if applicable

**File Too Large**:
- Limit file size to 10MB for editor
- Show warning modal: "File exceeds 10MB. Open in external editor?"
- Provide download button as alternative

**Invalid File Name**:
- Validate file names on client before sending to server
- Show inline error: "File name cannot contain: / \\ : * ? \" < > |"
- Prevent submission until valid

### Collaboration Errors

**Concurrent Edit Conflicts**:
- Use Operational Transformation (OT) or CRDT for conflict resolution
- Automatically merge non-conflicting changes
- For conflicting changes, show diff modal with "Keep Mine" / "Keep Theirs" / "Merge" options
- Highlight conflicted regions in editor

**User Kicked/Removed**:
- Immediately disconnect WebSocket
- Show modal: "You have been removed from this project"
- Redirect to project dashboard after 3 seconds
- Clear local project cache

**Session Expired**:
- Detect expired JWT token
- Save current work to local storage
- Show modal: "Your session has expired. Please sign in again."
- Redirect to sign-in page with return URL
- Restore work after re-authentication

### Validation Errors

**Project Creation**:
- Validate project name (3-50 characters, alphanumeric + spaces/hyphens)
- Check for duplicate project names
- Show inline error messages below form fields
- Disable submit button until all fields are valid

**Settings Updates**:
- Validate email format
- Validate password strength (min 8 chars, uppercase, lowercase, number, special char)
- Validate workspace name uniqueness
- Show field-specific error messages
- Highlight invalid fields in red

### User Feedback

**Loading States**:
- Show skeleton loaders for project cards, file tree, editor
- Display progress bar for file uploads
- Show spinner in buttons during async operations
- Disable interactive elements during loading

**Success Confirmations**:
- Show toast notifications for successful actions
- Auto-dismiss after 3 seconds
- Green checkmark icon for success
- Examples: "Project created", "File saved", "Collaborator invited"

**Error Messages**:
- Use clear, actionable language
- Avoid technical jargon
- Provide next steps or solutions
- Include error codes for support reference
- Examples: "Unable to save file. Check your connection and try again. (Error: E1001)"

## Testing Strategy

### Unit Testing

**Framework**: Jest + React Testing Library

**Component Testing**:
- Test component rendering with various props
- Test user interactions (clicks, keyboard input, drag-and-drop)
- Test conditional rendering based on state
- Test accessibility (ARIA labels, keyboard navigation)
- Mock external dependencies (API calls, WebSocket)

**Example Test Cases**:
- FileTree: Renders all files and folders, expands/collapses on click, shows context menu on right-click
- EditorTabs: Displays all open tabs, switches active tab on click, shows dirty indicator, closes tab with confirmation
- MonacoEditor: Loads file content, marks dirty on edit, saves on ⌘S, displays syntax highlighting
- Terminal: Opens terminal panel, sends input, displays output, resizes correctly
- ShareModal: Displays collaborators, sends invitations, updates roles, removes collaborators

**Hook Testing**:
- Test custom hooks in isolation
- Test state updates and side effects
- Test error handling in hooks
- Examples: useWebSocket, useFileTree, useEditorTabs, useCollaboration

**Utility Testing**:
- Test pure functions (sorting, filtering, validation)
- Test edge cases (empty arrays, null values, special characters)
- Test error conditions
- Examples: sortProjects, filterProjects, validateFileName, formatTimestamp

### Property-Based Testing

**Framework**: fast-check (JavaScript/TypeScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Use seed for reproducible failures
- Tag each test with feature name and property number
- Tag format: `Feature: authenticated-ui, Property {number}: {property_text}`

**Property Test Implementation**:

Each correctness property from the design document should be implemented as a property-based test. The test should:
1. Generate random valid inputs using fast-check arbitraries
2. Execute the system behavior
3. Assert the property holds for all generated inputs
4. Reference the design document property in a comment

**Example Property Tests**:

```typescript
// Feature: authenticated-ui, Property 2: View Toggle Idempotence
test('toggling view twice returns to original state', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('grid', 'list'),
      (initialView) => {
        const state = { view: initialView };
        toggleView(state);
        toggleView(state);
        expect(state.view).toBe(initialView);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: authenticated-ui, Property 3: Project Sorting Correctness
test('sorted projects are in correct order', () => {
  fc.assert(
    fc.property(
      fc.array(projectArbitrary),
      fc.constantFrom('lastModified', 'name', 'createdDate'),
      (projects, sortBy) => {
        const sorted = sortProjects(projects, sortBy);
        for (let i = 0; i < sorted.length - 1; i++) {
          expect(compareProjects(sorted[i], sorted[i + 1], sortBy)).toBeLessThanOrEqual(0);
        }
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: authenticated-ui, Property 6: Search Result Relevance
test('all search results match query', () => {
  fc.assert(
    fc.property(
      fc.array(projectArbitrary),
      fc.string(),
      (projects, query) => {
        const results = searchProjects(projects, query);
        results.forEach(project => {
          expect(projectMatchesQuery(project, query)).toBe(true);
        });
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: authenticated-ui, Property 14: Save Round-Trip
test('saving file persists changes and clears dirty state', () => {
  fc.assert(
    fc.property(
      fileArbitrary,
      fc.string(),
      async (file, newContent) => {
        const tab = openFile(file);
        editFile(tab, newContent);
        expect(tab.isDirty).toBe(true);
        
        await saveFile(tab);
        const loaded = await loadFile(file.id);
        
        expect(loaded.content).toBe(newContent);
        expect(tab.isDirty).toBe(false);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: authenticated-ui, Property 21: Terminal Panel Resize Invariant
test('terminal resize maintains total height', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 100, max: 500 }),
      fc.integer({ min: 50, max: 300 }),
      (totalHeight, terminalHeight) => {
        const state = { totalHeight, terminalHeight, editorHeight: totalHeight - terminalHeight };
        const newTerminalHeight = Math.min(terminalHeight + 50, totalHeight - 100);
        
        resizeTerminal(state, newTerminalHeight);
        
        expect(state.terminalHeight + state.editorHeight).toBe(totalHeight);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Arbitraries** (random data generators):
- `projectArbitrary`: Generates random project objects with valid fields
- `fileArbitrary`: Generates random file objects with valid paths and content
- `userArbitrary`: Generates random user objects with valid emails and names
- `collaboratorArbitrary`: Generates random collaborator presence data
- `chatMessageArbitrary`: Generates random chat messages with markdown

### Integration Testing

**Framework**: Playwright for end-to-end testing

**Test Scenarios**:
1. **Complete Project Workflow**: Create project → Add files → Edit code → Save → Share with collaborator
2. **Collaboration Flow**: User A opens project → User B joins → Both edit same file → Changes sync correctly
3. **Terminal Workflow**: Open terminal → Run commands → View output → Create new session → Switch between sessions
4. **Settings Workflow**: Update profile → Change editor settings → Verify changes persist → Sign out and back in → Verify settings restored

**WebSocket Testing**:
- Mock WebSocket server for testing real-time features
- Test connection establishment, message sending/receiving, reconnection logic
- Test concurrent user scenarios
- Test network interruption and recovery

### Performance Testing

**Metrics to Monitor**:
- Initial load time (< 2s for workspace)
- Time to interactive (< 3s)
- File open time (< 500ms for files under 1MB)
- Editor typing latency (< 50ms)
- WebSocket message latency (< 100ms)
- Memory usage (< 500MB for typical session)

**Load Testing**:
- Test with 100+ projects in dashboard
- Test with 50+ open tabs
- Test with 10+ concurrent collaborators
- Test with large files (5-10MB)
- Test with high-frequency WebSocket messages (100+ per second)

**Optimization Strategies**:
- Lazy load Monaco editor (code splitting)
- Virtualize project list and file tree (react-window)
- Debounce editor changes before sending to server
- Throttle cursor position updates (max 10 per second)
- Use Web Workers for heavy computations (syntax parsing, diff calculation)
- Implement pagination for project list
- Cache file contents in IndexedDB

### Accessibility Testing

**Requirements**:
- WCAG 2.1 Level AA compliance
- Keyboard navigation for all features
- Screen reader support
- High contrast mode support
- Focus indicators on all interactive elements

**Testing Tools**:
- axe-core for automated accessibility testing
- Manual testing with screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation testing
- Color contrast validation

**Key Accessibility Features**:
- ARIA labels for all icons and buttons
- Semantic HTML structure
- Skip links for keyboard navigation
- Focus trap in modals
- Keyboard shortcuts documentation
- Alt text for images and icons
- Live regions for dynamic content updates (chat messages, notifications)

### Test Coverage Goals

- Unit test coverage: > 80%
- Property test coverage: 100% of correctness properties
- Integration test coverage: All critical user flows
- Accessibility test coverage: All interactive components

### Continuous Integration

- Run unit tests on every commit
- Run property tests on every pull request
- Run integration tests on staging deployment
- Run performance tests weekly
- Generate coverage reports and track trends
- Block merges if tests fail or coverage drops

