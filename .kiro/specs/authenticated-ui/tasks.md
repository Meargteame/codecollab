# Implementation Plan: Authenticated Workspace UI

## Overview

This implementation plan builds the complete authenticated workspace interface for CodeCollab in four phases:
1. Workspace layout and project management (enhance existing implementation)
2. Code editor interface (Monaco editor, file tree, terminal)
3. Real-time collaboration features (WebSocket, cursors, chat)
4. Settings and profile management

The implementation uses TypeScript with Next.js and React, following the existing codebase structure. Each task references specific requirements and includes property-based tests for correctness validation.

## Phase 1: Workspace Layout & Project Management

- [ ] 1. Extract and enhance Sidebar component
  - [ ] 1.1 Extract sidebar from workspace page into reusable component
    - Create `frontend/components/Sidebar.tsx` with collapsible functionality
    - Add active state management for navigation links
    - Implement keyboard shortcuts for navigation
    - _Requirements: 1.3_

  - [ ]* 1.2 Write unit tests for Sidebar component
    - Test rendering with various props
    - Test collapse/expand functionality
    - Test active state highlighting
    - _Requirements: 1.3_

- [ ] 2. Implement top navigation bar enhancements
  - [ ] 2.1 Create WorkspaceSwitcher dropdown component
    - Build dropdown with workspace list
    - Add workspace creation option
    - Implement workspace switching logic
    - _Requirements: 1.5_

  - [ ] 2.2 Create GlobalSearch modal component
    - Build search modal with ⌘K/Ctrl+K shortcut
    - Implement fuzzy search across projects and files
    - Add keyboard navigation for results
    - _Requirements: 1.6_

  - [ ] 2.3 Create NotificationsDropdown component
    - Build dropdown with notification list
    - Add notification types (mentions, invites, system)
    - Implement mark as read functionality
    - _Requirements: 1.7_

  - [ ] 2.4 Create UserMenu dropdown component
    - Build dropdown with profile, settings, sign out options
    - Add navigation to profile and settings pages
    - Implement sign out functionality
    - _Requirements: 1.8_

  - [ ]* 2.5 Write unit tests for navigation components
    - Test WorkspaceSwitcher dropdown behavior
    - Test GlobalSearch keyboard shortcuts and search
    - Test NotificationsDropdown rendering and interactions
    - Test UserMenu navigation and sign out
    - _Requirements: 1.5, 1.6, 1.7, 1.8_


- [ ] 3. Enhance ProjectDashboard with full functionality
  - [ ] 3.1 Connect project dashboard to API
    - Create API client for project CRUD operations
    - Implement React Query hooks for project data
    - Add loading and error states
    - _Requirements: 2.1_

  - [ ]* 3.2 Write property test for project display completeness
    - **Property 1: Project Display Completeness**
    - **Validates: Requirements 2.1**
    - Test that all accessible projects are displayed

  - [ ] 3.3 Implement view toggle functionality
    - Add state management for grid/list view
    - Create list view layout component
    - Persist view preference to local storage
    - _Requirements: 2.2_

  - [ ]* 3.4 Write property test for view toggle idempotence
    - **Property 2: View Toggle Idempotence**
    - **Validates: Requirements 2.2**
    - Test that toggling view twice returns to original state

  - [ ] 3.5 Implement project sorting
    - Add sort dropdown with options (last modified, name, created date)
    - Implement sorting logic for each criteria
    - Persist sort preference
    - _Requirements: 2.3_

  - [ ]* 3.6 Write property test for project sorting correctness
    - **Property 3: Project Sorting Correctness**
    - **Validates: Requirements 2.3**
    - Test that sorted projects are in correct order

  - [ ] 3.7 Implement project navigation
    - Add click handlers to project cards
    - Navigate to editor workspace with project ID
    - Handle navigation errors
    - _Requirements: 2.4_

  - [ ]* 3.8 Write property test for project navigation consistency
    - **Property 4: Project Navigation Consistency**
    - **Validates: Requirements 2.4**
    - Test that clicking project navigates to correct URL

  - [ ] 3.9 Create ProjectCreationModal component
    - Build modal with project name and template selection
    - Implement project creation API call
    - Add validation for project name
    - Navigate to new project after creation
    - _Requirements: 2.5, 2.6_

  - [ ]* 3.10 Write property test for template project creation
    - **Property 5: Template Project Creation**
    - **Validates: Requirements 2.6**
    - Test that template creates correct file structure

  - [ ] 3.11 Implement project search and filtering
    - Add search input to dashboard header
    - Implement client-side filtering by name/description
    - Debounce search input
    - _Requirements: 2.7_

  - [ ]* 3.12 Write property test for search result relevance
    - **Property 6: Search Result Relevance**
    - **Validates: Requirements 2.7**
    - Test that all search results match query

  - [ ] 3.13 Create ProjectSettingsModal component
    - Build modal with project configuration options
    - Implement project update API call
    - Add project deletion with confirmation
    - _Requirements: 2.8_

  - [ ] 3.14 Create ProjectShareModal component (basic structure)
    - Build modal with collaborator list
    - Add invite by email input
    - Display current permissions
    - _Requirements: 2.9_

  - [ ]* 3.15 Write unit tests for project modals
    - Test ProjectCreationModal validation and submission
    - Test ProjectSettingsModal update and delete
    - Test ProjectShareModal display and invite
    - _Requirements: 2.5, 2.8, 2.9_

- [ ] 4. Checkpoint - Phase 1 Complete
  - Ensure all tests pass, ask the user if questions arise.


## Phase 2: Code Editor Interface

- [ ] 5. Set up editor workspace structure
  - [ ] 5.1 Create editor workspace page and layout
    - Create `frontend/app/(workspace)/editor/[projectId]/page.tsx`
    - Set up three-column layout (file tree, editor, collaboration sidebar)
    - Add resizable panels with drag handles
    - _Requirements: 3.1, 4.1, 10.1_

  - [ ] 5.2 Create workspace context for editor state
    - Create `frontend/contexts/EditorContext.tsx`
    - Define state for file tree, open tabs, active file
    - Add actions for file operations and tab management
    - _Requirements: 3.1, 4.5_

  - [ ]* 5.3 Write unit tests for editor context
    - Test state initialization
    - Test state updates for file operations
    - Test tab management actions
    - _Requirements: 3.1, 4.5_

- [ ] 6. Implement FileTree component
  - [ ] 6.1 Create FileTree component with recursive rendering
    - Create `frontend/components/FileTree.tsx`
    - Implement recursive tree node rendering
    - Add expand/collapse functionality for folders
    - Add file icons based on extension
    - _Requirements: 3.1, 3.2_

  - [ ]* 6.2 Write property test for file tree completeness
    - **Property 7: File Tree Completeness**
    - **Validates: Requirements 3.1**
    - Test that all project files are displayed

  - [ ]* 6.3 Write property test for folder expansion toggle
    - **Property 8: Folder Expansion Toggle**
    - **Validates: Requirements 3.2**
    - Test that clicking folder twice returns to original state

  - [ ] 6.4 Implement file selection and opening
    - Add click handlers for files
    - Update active file in context
    - Open file in editor
    - _Requirements: 3.3_

  - [ ]* 6.5 Write property test for file opening consistency
    - **Property 9: File Opening Consistency**
    - **Validates: Requirements 3.3**
    - Test that clicking file opens it in editor

  - [ ] 6.6 Create context menu for file operations
    - Add right-click context menu component
    - Implement New File, New Folder, Rename, Delete options
    - Add keyboard shortcuts for common operations
    - _Requirements: 3.4_

  - [ ] 6.7 Implement file CRUD operations
    - Create API client for file operations
    - Implement create, rename, delete file/folder
    - Update file tree after operations
    - Update open tabs when files are renamed/deleted
    - _Requirements: 3.5, 3.6, 3.7_

  - [ ]* 6.8 Write property test for file tree operation synchronization
    - **Property 10: File Tree Operation Synchronization**
    - **Validates: Requirements 3.5, 3.6, 3.7**
    - Test that operations update both tree and tabs

  - [ ] 6.9 Implement drag-and-drop file organization
    - Add drag-and-drop handlers to tree nodes
    - Implement file/folder repositioning logic
    - Update file paths after move operations
    - _Requirements: 3.8_

  - [ ]* 6.10 Write property test for drag-and-drop validity
    - **Property 11: File Tree Drag-and-Drop Validity**
    - **Validates: Requirements 3.8**
    - Test that dragging repositions items correctly

  - [ ]* 6.11 Write unit tests for FileTree component
    - Test rendering with nested structure
    - Test context menu interactions
    - Test file operations
    - Test drag-and-drop behavior
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.8_


- [ ] 7. Implement Monaco Editor integration
  - [ ] 7.1 Install and configure Monaco editor
    - Install `@monaco-editor/react` package
    - Create `frontend/components/MonacoEditor.tsx`
    - Configure editor options (theme, font, tab size)
    - _Requirements: 4.1_

  - [ ] 7.2 Implement file content loading and display
    - Load file content from API
    - Display content in Monaco editor
    - Apply syntax highlighting based on file extension
    - _Requirements: 4.1, 4.9_

  - [ ]* 7.3 Write property test for file content display
    - **Property 12: File Content Display**
    - **Validates: Requirements 4.1, 4.9**
    - Test that file content is displayed correctly with syntax highlighting

  - [ ] 7.4 Implement dirty state tracking
    - Track unsaved changes in editor
    - Mark tab as dirty when content changes
    - Clear dirty state after save
    - _Requirements: 4.2_

  - [ ]* 7.5 Write property test for dirty state tracking
    - **Property 13: Dirty State Tracking**
    - **Validates: Requirements 4.2**
    - Test that edits mark tab as dirty

  - [ ] 7.6 Implement file save functionality
    - Add save handler for ⌘S/Ctrl+S
    - Send file content to API
    - Update dirty state after successful save
    - Show save status in UI
    - _Requirements: 4.3, 4.4_

  - [ ]* 7.7 Write property test for save round-trip
    - **Property 14: Save Round-Trip**
    - **Validates: Requirements 4.4**
    - Test that saving persists changes and clears dirty state

  - [ ] 7.8 Implement auto-save functionality
    - Add auto-save toggle in settings
    - Debounce auto-save (2 seconds after last edit)
    - Show auto-save indicator in UI
    - _Requirements: 4.11_

  - [ ]* 7.9 Write property test for auto-save behavior
    - **Property 18: Auto-Save Behavior**
    - **Validates: Requirements 4.11**
    - Test that auto-save triggers after debounce period

  - [ ] 7.10 Configure IntelliSense and autocomplete
    - Enable Monaco's built-in IntelliSense
    - Configure language-specific features
    - Add custom completions if needed
    - _Requirements: 4.10_

  - [ ]* 7.11 Write unit tests for MonacoEditor component
    - Test editor initialization
    - Test content loading and display
    - Test save functionality
    - Test keyboard shortcuts
    - _Requirements: 4.1, 4.3, 4.9, 4.10_

- [ ] 8. Implement EditorTabs component
  - [ ] 8.1 Create EditorTabs component
    - Create `frontend/components/EditorTabs.tsx`
    - Display tabs for all open files
    - Show active tab indicator
    - Show dirty indicator for unsaved changes
    - _Requirements: 4.5, 4.6_

  - [ ]* 8.2 Write property test for tab management consistency
    - **Property 15: Tab Management Consistency**
    - **Validates: Requirements 4.5, 4.6**
    - Test that each open file has a tab and clicking switches files

  - [ ] 8.3 Implement tab switching
    - Add click handlers to tabs
    - Update active file in context
    - Switch editor content
    - _Requirements: 4.6_

  - [ ] 8.4 Implement tab closing with unsaved changes protection
    - Add close button to each tab
    - Show confirmation modal for dirty tabs
    - Remove tab from state after confirmation
    - _Requirements: 4.7_

  - [ ]* 8.5 Write property test for unsaved changes protection
    - **Property 16: Unsaved Changes Protection**
    - **Validates: Requirements 4.7**
    - Test that closing dirty tab triggers confirmation

  - [ ] 8.6 Implement tab reordering
    - Add drag-and-drop to tabs
    - Update tab order in state
    - Persist tab order preference
    - _Requirements: 4.8_

  - [ ]* 8.7 Write property test for tab reordering
    - **Property 17: Tab Reordering**
    - **Validates: Requirements 4.8**
    - Test that dragging updates tab order

  - [ ] 8.8 Add tab context menu
    - Add right-click menu to tabs
    - Implement Close, Close Others, Close All options
    - Add keyboard shortcuts
    - _Requirements: 4.7_

  - [ ]* 8.9 Write unit tests for EditorTabs component
    - Test tab rendering and switching
    - Test close functionality with confirmation
    - Test drag-and-drop reordering
    - Test context menu actions
    - _Requirements: 4.5, 4.6, 4.7, 4.8_


- [ ] 9. Implement Terminal integration
  - [ ] 9.1 Install and configure xterm.js
    - Install `xterm` and `xterm-addon-fit` packages
    - Create `frontend/components/Terminal.tsx`
    - Configure terminal theme and options
    - _Requirements: 5.1_

  - [ ] 9.2 Create terminal panel with resize functionality
    - Add terminal panel at bottom of editor
    - Implement resize handle with drag functionality
    - Update editor height when terminal resizes
    - Add collapse/expand functionality
    - _Requirements: 5.1, 5.4, 5.5_

  - [ ]* 9.3 Write property test for terminal panel resize invariant
    - **Property 21: Terminal Panel Resize Invariant**
    - **Validates: Requirements 5.4**
    - Test that terminal + editor height equals total height

  - [ ] 9.4 Implement WebSocket connection for terminal I/O
    - Create WebSocket client for terminal
    - Establish connection when terminal opens
    - Handle connection errors and reconnection
    - _Requirements: 5.2_

  - [ ]* 9.5 Write property test for terminal connection establishment
    - **Property 19: Terminal Connection Establishment**
    - **Validates: Requirements 5.2**
    - Test that opening terminal establishes WebSocket connection

  - [ ] 9.6 Implement terminal input/output streaming
    - Send user input to server via WebSocket
    - Receive and display output from server
    - Handle special keys (arrows, backspace, etc.)
    - _Requirements: 5.3_

  - [ ]* 9.7 Write property test for terminal I/O round-trip
    - **Property 20: Terminal I/O Round-Trip**
    - **Validates: Requirements 5.3**
    - Test that input is sent and output is displayed

  - [ ] 9.8 Implement multiple terminal sessions
    - Add terminal tabs for multiple sessions
    - Create new terminal session functionality
    - Switch between terminal sessions
    - Close terminal sessions
    - _Requirements: 5.6, 5.7_

  - [ ]* 9.9 Write property test for terminal session management
    - **Property 22: Terminal Session Management**
    - **Validates: Requirements 5.6, 5.7**
    - Test that new sessions are created and switching works

  - [ ]* 9.10 Write unit tests for Terminal component
    - Test terminal initialization
    - Test resize functionality
    - Test input/output handling
    - Test multiple session management
    - _Requirements: 5.1, 5.3, 5.4, 5.6, 5.7_

- [ ] 10. Implement panel resizing and persistence
  - [ ] 10.1 Create ResizeHandle component
    - Create `frontend/components/ResizeHandle.tsx`
    - Implement drag handlers for resizing
    - Add visual feedback during drag
    - _Requirements: 10.1, 10.2_

  - [ ] 10.2 Implement sidebar collapse functionality
    - Add collapse buttons to sidebars
    - Animate sidebar collapse/expand
    - Adjust editor width when sidebars collapse
    - _Requirements: 10.3, 10.4_

  - [ ]* 10.3 Write property test for panel resize responsiveness
    - **Property 46: Panel Resize Responsiveness**
    - **Validates: Requirements 10.1, 10.2**
    - Test that dragging adjusts panel dimensions

  - [ ]* 10.4 Write property test for sidebar collapse invariant
    - **Property 47: Sidebar Collapse Invariant**
    - **Validates: Requirements 10.3, 10.4**
    - Test that collapsing sidebar expands editor area

  - [ ] 10.5 Implement panel size persistence
    - Save panel sizes to local storage
    - Restore panel sizes on workspace load
    - Handle invalid stored values
    - _Requirements: 10.5, 10.6_

  - [ ]* 10.6 Write property test for panel size persistence round-trip
    - **Property 48: Panel Size Persistence Round-Trip**
    - **Validates: Requirements 10.5, 10.6**
    - Test that resized panels are restored on reload

  - [ ]* 10.7 Write unit tests for resize functionality
    - Test ResizeHandle drag behavior
    - Test sidebar collapse/expand
    - Test size persistence
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 11. Checkpoint - Phase 2 Complete
  - Ensure all tests pass, ask the user if questions arise.


## Phase 3: Real-time Collaboration Features

- [ ] 12. Set up WebSocket infrastructure for collaboration
  - [ ] 12.1 Create WebSocket client for collaboration
    - Create `frontend/lib/collaborationSocket.ts`
    - Implement connection management with reconnection logic
    - Add event emitter for collaboration events
    - Handle authentication with JWT
    - _Requirements: 6.1_

  - [ ]* 12.2 Write property test for collaboration connection establishment
    - **Property 23: Collaboration Connection Establishment**
    - **Validates: Requirements 6.1**
    - Test that joining project establishes WebSocket connection

  - [ ] 12.3 Create collaboration context
    - Create `frontend/contexts/CollaborationContext.tsx`
    - Manage collaborator presence state
    - Handle incoming collaboration events
    - Provide actions for sending collaboration events
    - _Requirements: 6.1, 6.2_

  - [ ]* 12.4 Write unit tests for collaboration socket
    - Test connection establishment
    - Test reconnection logic
    - Test event emission and handling
    - Test authentication
    - _Requirements: 6.1_

- [ ] 13. Implement CollaborationSidebar component
  - [ ] 13.1 Create CollaborationSidebar component
    - Create `frontend/components/CollaborationSidebar.tsx`
    - Display list of active collaborators
    - Show presence indicators (active/idle/offline)
    - Display current file for each collaborator
    - _Requirements: 6.2_

  - [ ]* 13.2 Write property test for collaborator presence display
    - **Property 24: Collaborator Presence Display**
    - **Validates: Requirements 6.2**
    - Test that joining collaborators are displayed

  - [ ] 13.3 Implement collaborator status updates
    - Update status to idle after 5 minutes of inactivity
    - Update status to offline when connection lost
    - Show last seen timestamp for offline users
    - _Requirements: 6.7, 6.8_

  - [ ]* 13.4 Write property test for collaborator status updates
    - **Property 29: Collaborator Status Updates**
    - **Validates: Requirements 6.7, 6.8**
    - Test that status updates correctly based on activity

  - [ ] 13.5 Add invite collaborator functionality
    - Add invite button to sidebar
    - Open share modal on click
    - _Requirements: 6.2_

  - [ ] 13.6 Implement follow collaborator feature
    - Add follow button to each collaborator
    - Jump to collaborator's cursor position
    - Scroll to their viewport
    - _Requirements: 6.2_

  - [ ]* 13.7 Write unit tests for CollaborationSidebar
    - Test collaborator list rendering
    - Test status indicators
    - Test follow functionality
    - _Requirements: 6.2, 6.7, 6.8_

- [ ] 14. Implement collaborative cursors and selections
  - [ ] 14.1 Add cursor position tracking
    - Track local cursor position in editor
    - Broadcast cursor position via WebSocket
    - Throttle cursor updates (max 10 per second)
    - _Requirements: 6.3_

  - [ ]* 14.2 Write property test for cursor position synchronization
    - **Property 25: Cursor Position Synchronization**
    - **Validates: Requirements 6.3**
    - Test that cursor movements are displayed for collaborators

  - [ ] 14.3 Render remote cursors in editor
    - Create cursor decorations in Monaco editor
    - Assign unique colors to each collaborator
    - Display collaborator name tooltip on cursor
    - Update cursor position on remote events
    - _Requirements: 6.3_

  - [ ] 14.4 Implement selection highlighting
    - Track local text selections
    - Broadcast selections via WebSocket
    - Render remote selections with collaborator colors
    - _Requirements: 6.4_

  - [ ]* 14.5 Write property test for selection highlighting
    - **Property 26: Selection Highlighting**
    - **Validates: Requirements 6.4**
    - Test that selections are highlighted with correct colors

  - [ ]* 14.6 Write unit tests for cursor and selection rendering
    - Test cursor decoration creation
    - Test color assignment
    - Test tooltip display
    - Test selection highlighting
    - _Requirements: 6.3, 6.4_


- [ ] 15. Implement real-time collaborative editing
  - [ ] 15.1 Implement Operational Transformation (OT) for conflict resolution
    - Install OT library or implement basic OT algorithm
    - Transform local changes against remote changes
    - Apply transformed changes to editor
    - _Requirements: 6.5_

  - [ ] 15.2 Broadcast file changes via WebSocket
    - Capture editor changes (insertions, deletions)
    - Send changes to server via WebSocket
    - Include change metadata (position, text, user)
    - _Requirements: 6.5_

  - [ ] 15.3 Apply remote file changes to editor
    - Receive remote changes from WebSocket
    - Transform changes using OT
    - Apply changes to Monaco editor
    - Preserve local cursor position
    - _Requirements: 6.5_

  - [ ]* 15.4 Write property test for real-time edit propagation
    - **Property 27: Real-Time Edit Propagation**
    - **Validates: Requirements 6.5**
    - Test that remote edits are applied correctly

  - [ ]* 15.5 Write unit tests for collaborative editing
    - Test change capture and broadcasting
    - Test OT transformation
    - Test remote change application
    - Test cursor preservation
    - _Requirements: 6.5_

- [ ] 16. Implement presence cleanup
  - [ ] 16.1 Handle user disconnect events
    - Listen for user left events from WebSocket
    - Remove collaborator from presence list
    - Remove their cursor and selection decorations
    - _Requirements: 6.6_

  - [ ]* 16.2 Write property test for presence cleanup
    - **Property 28: Presence Cleanup**
    - **Validates: Requirements 6.6**
    - Test that leaving users have all presence indicators removed

  - [ ]* 16.3 Write unit tests for presence cleanup
    - Test disconnect event handling
    - Test presence removal
    - Test decoration cleanup
    - _Requirements: 6.6_

- [ ] 17. Implement ChatPanel component
  - [ ] 17.1 Create ChatPanel component
    - Create `frontend/components/ChatPanel.tsx`
    - Display chat messages with timestamps
    - Show user avatars and names
    - Auto-scroll to latest message
    - _Requirements: 7.1, 7.3_

  - [ ] 17.2 Implement message sending
    - Add message input field
    - Send messages via WebSocket
    - Clear input after sending
    - Show sending indicator
    - _Requirements: 7.2_

  - [ ]* 17.3 Write property test for chat message broadcasting
    - **Property 30: Chat Message Broadcasting**
    - **Validates: Requirements 7.2, 7.3**
    - Test that messages are broadcast to all collaborators

  - [ ] 17.4 Implement markdown rendering in messages
    - Install markdown parser (e.g., marked or remark)
    - Render markdown content in messages
    - Sanitize HTML to prevent XSS
    - _Requirements: 7.5_

  - [ ]* 17.5 Write property test for markdown rendering
    - **Property 32: Markdown Rendering**
    - **Validates: Requirements 7.5**
    - Test that markdown is rendered correctly

  - [ ] 17.6 Implement @mentions functionality
    - Parse @mentions in messages
    - Highlight mentioned users
    - Send notifications to mentioned users
    - _Requirements: 7.4_

  - [ ]* 17.7 Write property test for mention notifications
    - **Property 31: Mention Notifications**
    - **Validates: Requirements 7.4**
    - Test that @mentions trigger notifications

  - [ ] 17.8 Implement system messages
    - Display system events (user joined, user left, file edited)
    - Style system messages differently from user messages
    - _Requirements: 7.6_

  - [ ]* 17.9 Write property test for system event messages
    - **Property 33: System Event Messages**
    - **Validates: Requirements 7.6**
    - Test that system events generate messages

  - [ ] 17.10 Add emoji picker
    - Install emoji picker component
    - Add emoji button to message input
    - Insert emoji at cursor position
    - _Requirements: 7.2_

  - [ ]* 17.11 Write unit tests for ChatPanel
    - Test message rendering
    - Test message sending
    - Test markdown rendering
    - Test @mentions
    - Test system messages
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_


- [ ] 18. Enhance ProjectShareModal with full functionality
  - [ ] 18.1 Display current collaborators with roles
    - Fetch project collaborators from API
    - Display collaborator list with avatars and roles
    - Show owner, editor, viewer badges
    - _Requirements: 8.1_

  - [ ]* 18.2 Write property test for collaborator list completeness
    - **Property 34: Collaborator List Completeness**
    - **Validates: Requirements 8.1**
    - Test that all collaborators are displayed

  - [ ] 18.3 Implement invite by email
    - Add email input field
    - Validate email format
    - Send invitation via API
    - Add invitee to pending collaborators list
    - _Requirements: 8.2_

  - [ ]* 18.4 Write property test for invitation delivery
    - **Property 35: Invitation Delivery**
    - **Validates: Requirements 8.2**
    - Test that invitations are sent and users are added

  - [ ] 18.5 Implement share link generation
    - Add "Generate Link" button
    - Create unique share link via API
    - Display link with copy button
    - Add link expiration settings
    - _Requirements: 8.3_

  - [ ]* 18.6 Write property test for share link uniqueness
    - **Property 36: Share Link Uniqueness**
    - **Validates: Requirements 8.3**
    - Test that generated links are unique

  - [ ] 18.7 Implement role management
    - Add role dropdown for each collaborator
    - Update role via API
    - Enforce role-based permissions (viewer, editor, owner)
    - _Requirements: 8.4, 8.5, 8.6_

  - [ ]* 18.8 Write property test for role-based access control
    - **Property 37: Role-Based Access Control**
    - **Validates: Requirements 8.4, 8.5, 8.6**
    - Test that roles enforce correct permissions

  - [ ] 18.9 Implement collaborator removal
    - Add remove button for each collaborator
    - Confirm removal with modal
    - Revoke access via API
    - Disconnect user if currently online
    - _Requirements: 8.7_

  - [ ]* 18.10 Write property test for collaborator removal
    - **Property 38: Collaborator Removal**
    - **Validates: Requirements 8.7**
    - Test that removal revokes access and disconnects user

  - [ ] 18.11 Implement public/private toggle
    - Add visibility toggle switch
    - Update project visibility via API
    - Show warning when making project public
    - _Requirements: 8.8_

  - [ ]* 18.12 Write property test for public project access
    - **Property 39: Public Project Access**
    - **Validates: Requirements 8.8**
    - Test that public projects are accessible via link

  - [ ]* 18.13 Write unit tests for ProjectShareModal
    - Test collaborator list display
    - Test email invitation
    - Test share link generation
    - Test role management
    - Test collaborator removal
    - Test visibility toggle
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 19. Checkpoint - Phase 3 Complete
  - Ensure all tests pass, ask the user if questions arise.


## Phase 4: Settings & Profile Management

- [ ] 20. Create SettingsPage layout and navigation
  - [ ] 20.1 Create settings page with sidebar navigation
    - Create `frontend/app/(workspace)/settings/page.tsx`
    - Add left sidebar with section links
    - Create section components (Profile, Account, Workspace, Editor, Billing, Team, Integrations)
    - Implement section routing with URL hash
    - _Requirements: 9.1_

  - [ ]* 20.2 Write unit tests for settings page layout
    - Test sidebar navigation
    - Test section rendering
    - Test URL hash routing
    - _Requirements: 9.1_

- [ ] 21. Implement Profile settings section
  - [ ] 21.1 Create ProfileSettings component
    - Create `frontend/components/settings/ProfileSettings.tsx`
    - Add form fields for name, email, avatar, bio
    - Add avatar upload functionality
    - Add save button
    - _Requirements: 9.2_

  - [ ] 21.2 Implement profile update functionality
    - Validate form inputs
    - Send update request to API
    - Show success/error toast notifications
    - Update user context with new data
    - _Requirements: 9.2_

  - [ ]* 21.3 Write property test for settings persistence round-trip
    - **Property 40: Settings Persistence Round-Trip**
    - **Validates: Requirements 9.2**
    - Test that profile updates are persisted and reflected

  - [ ]* 21.4 Write unit tests for ProfileSettings
    - Test form rendering
    - Test validation
    - Test update submission
    - Test avatar upload
    - _Requirements: 9.2_

- [ ] 22. Implement Account settings section
  - [ ] 22.1 Create AccountSettings component
    - Create `frontend/components/settings/AccountSettings.tsx`
    - Add password change form
    - Add 2FA enable/disable toggle
    - Add delete account button
    - _Requirements: 9.3, 9.4_

  - [ ] 22.2 Implement password change functionality
    - Validate current password
    - Validate new password strength
    - Send password update to API
    - Show success/error notifications
    - _Requirements: 9.3_

  - [ ]* 22.3 Write property test for password update security
    - **Property 41: Password Update Security**
    - **Validates: Requirements 9.3**
    - Test that password is validated and updated securely

  - [ ] 22.4 Implement 2FA enable/disable
    - Generate QR code for 2FA setup
    - Verify 2FA code before enabling
    - Store 2FA status in user settings
    - Require 2FA on next login after enabling
    - _Requirements: 9.4_

  - [ ]* 22.5 Write property test for 2FA enforcement
    - **Property 42: Two-Factor Authentication Enforcement**
    - **Validates: Requirements 9.4**
    - Test that enabling 2FA requires it on next login

  - [ ] 22.6 Implement account deletion
    - Show confirmation modal with warning
    - Require password confirmation
    - Delete account via API
    - Sign out and redirect to home page
    - _Requirements: 9.3_

  - [ ]* 22.7 Write unit tests for AccountSettings
    - Test password change form
    - Test 2FA setup flow
    - Test account deletion confirmation
    - _Requirements: 9.3, 9.4_

- [ ] 23. Implement Workspace settings section
  - [ ] 23.1 Create WorkspaceSettings component
    - Create `frontend/components/settings/WorkspaceSettings.tsx`
    - Add default workspace selector
    - Add workspace name input
    - Add workspace creation form
    - _Requirements: 9.1_

  - [ ] 23.2 Implement workspace management
    - Update default workspace preference
    - Rename workspace
    - Create new workspace
    - Delete workspace with confirmation
    - _Requirements: 9.1_

  - [ ]* 23.3 Write unit tests for WorkspaceSettings
    - Test workspace selector
    - Test workspace rename
    - Test workspace creation
    - _Requirements: 9.1_


- [ ] 24. Implement Editor settings section
  - [ ] 24.1 Create EditorSettings component
    - Create `frontend/components/settings/EditorSettings.tsx`
    - Add theme selector (dark/light)
    - Add font size slider
    - Add tab size input
    - Add keybindings selector (default/vim/emacs)
    - Add auto-save toggle
    - _Requirements: 9.5, 9.6_

  - [ ] 24.2 Implement editor settings updates
    - Apply theme change immediately to editor
    - Apply font size change to editor
    - Apply tab size to editor
    - Update keybindings throughout app
    - Persist settings to API
    - _Requirements: 9.5, 9.6_

  - [ ]* 24.3 Write property test for keybinding update propagation
    - **Property 43: Keybinding Update Propagation**
    - **Validates: Requirements 9.6**
    - Test that keybinding changes update all shortcuts

  - [ ]* 24.4 Write unit tests for EditorSettings
    - Test theme selector
    - Test font size slider
    - Test tab size input
    - Test keybindings selector
    - Test immediate application of changes
    - _Requirements: 9.5, 9.6_

- [ ] 25. Implement Billing settings section
  - [ ] 25.1 Create BillingSettings component
    - Create `frontend/components/settings/BillingSettings.tsx`
    - Display current subscription plan
    - Add payment method form
    - Display invoice history
    - Add plan upgrade/downgrade options
    - _Requirements: 9.7_

  - [ ] 25.2 Implement payment method management
    - Integrate payment provider (Stripe)
    - Add credit card form with validation
    - Securely send payment info to API
    - Display saved payment methods
    - _Requirements: 9.7_

  - [ ]* 25.3 Write property test for billing information security
    - **Property 44: Billing Information Security**
    - **Validates: Requirements 9.7**
    - Test that payment info is stored securely

  - [ ] 25.3 Implement subscription management
    - Display plan comparison
    - Handle plan upgrades/downgrades
    - Show prorated charges
    - Cancel subscription with confirmation
    - _Requirements: 9.7_

  - [ ]* 25.4 Write unit tests for BillingSettings
    - Test payment form validation
    - Test plan display
    - Test invoice history
    - _Requirements: 9.7_

- [ ] 26. Implement Team settings section
  - [ ] 26.1 Create TeamSettings component
    - Create `frontend/components/settings/TeamSettings.tsx`
    - Display team members list
    - Add invite member form
    - Show member roles
    - Add remove member functionality
    - _Requirements: 9.8_

  - [ ] 26.2 Implement team member management
    - Send team invitations via email
    - Update member roles
    - Remove team members
    - Display pending invitations
    - _Requirements: 9.8_

  - [ ]* 26.3 Write unit tests for TeamSettings
    - Test member list display
    - Test invitation sending
    - Test role updates
    - Test member removal
    - _Requirements: 9.8_

- [ ] 27. Implement Integrations settings section
  - [ ] 27.1 Create IntegrationsSettings component
    - Create `frontend/components/settings/IntegrationsSettings.tsx`
    - Display available integrations (GitHub, GitLab, Slack, Discord)
    - Show connection status for each integration
    - Add connect/disconnect buttons
    - _Requirements: 9.9_

  - [ ] 27.2 Implement GitHub integration
    - Add OAuth flow for GitHub authentication
    - Store GitHub access token securely
    - Display connected repositories
    - Add disconnect functionality
    - _Requirements: 9.9_

  - [ ] 27.3 Implement GitLab integration
    - Add OAuth flow for GitLab authentication
    - Store GitLab access token securely
    - Display connected repositories
    - Add disconnect functionality
    - _Requirements: 9.9_

  - [ ] 27.4 Implement Slack integration
    - Add OAuth flow for Slack authentication
    - Store Slack access token securely
    - Configure notification channels
    - Add disconnect functionality
    - _Requirements: 9.9_

  - [ ] 27.5 Implement Discord integration
    - Add OAuth flow for Discord authentication
    - Store Discord access token securely
    - Configure notification channels
    - Add disconnect functionality
    - _Requirements: 9.9_

  - [ ]* 27.6 Write property test for integration connection persistence
    - **Property 45: Integration Connection Persistence**
    - **Validates: Requirements 9.9**
    - Test that integrations are connected and persisted securely

  - [ ]* 27.7 Write unit tests for IntegrationsSettings
    - Test integration list display
    - Test OAuth flows
    - Test connection status
    - Test disconnect functionality
    - _Requirements: 9.9_


- [ ] 28. Create ProfilePage for public profiles
  - [ ] 28.1 Create profile page component
    - Create `frontend/app/(workspace)/profile/[userId]/page.tsx`
    - Display user information (name, avatar, bio)
    - Show activity feed (recent projects, contributions)
    - Display statistics (projects created, collaborations)
    - Add social links section
    - _Requirements: 9.1_

  - [ ] 28.2 Implement public/private profile toggle
    - Add privacy toggle in profile settings
    - Hide profile from public when private
    - Show privacy indicator on profile page
    - _Requirements: 9.1_

  - [ ]* 28.3 Write unit tests for ProfilePage
    - Test profile information display
    - Test activity feed rendering
    - Test statistics display
    - Test privacy toggle
    - _Requirements: 9.1_

- [ ] 29. Implement error handling and loading states
  - [ ] 29.1 Add error boundaries to settings sections
    - Create error boundary component
    - Wrap each settings section
    - Display user-friendly error messages
    - Add retry functionality
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

  - [ ] 29.2 Add loading states to all settings forms
    - Show skeleton loaders while fetching data
    - Disable form inputs during submission
    - Show loading spinners on buttons
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

  - [ ] 29.3 Implement toast notifications for settings
    - Show success toasts for successful updates
    - Show error toasts with actionable messages
    - Auto-dismiss after 3 seconds
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

  - [ ]* 29.4 Write unit tests for error handling
    - Test error boundary rendering
    - Test loading states
    - Test toast notifications
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

- [ ] 30. Checkpoint - Phase 4 Complete
  - Ensure all tests pass, ask the user if questions arise.

## Final Integration and Polish

- [ ] 31. Implement global error handling
  - [ ] 31.1 Create global error boundary
    - Wrap entire app with error boundary
    - Display fallback UI for critical errors
    - Log errors to monitoring service
    - Add "Report Issue" button
    - _Requirements: All_

  - [ ] 31.2 Implement WebSocket error handling
    - Handle connection failures with retry logic
    - Show connection status indicator
    - Queue operations during disconnection
    - Sync queued operations on reconnection
    - _Requirements: 5.2, 6.1_

  - [ ] 31.3 Implement API error handling
    - Add retry logic for failed requests
    - Show user-friendly error messages
    - Handle authentication errors (redirect to login)
    - Handle rate limiting
    - _Requirements: All_

  - [ ]* 31.4 Write unit tests for error handling
    - Test error boundary fallback
    - Test WebSocket reconnection
    - Test API retry logic
    - _Requirements: All_

- [ ] 32. Implement accessibility features
  - [ ] 32.1 Add ARIA labels to all interactive elements
    - Add labels to buttons, inputs, dropdowns
    - Add descriptions to complex components
    - Add live regions for dynamic updates
    - _Requirements: All_

  - [ ] 32.2 Implement keyboard navigation
    - Add keyboard shortcuts documentation
    - Ensure all features accessible via keyboard
    - Add focus indicators
    - Implement focus traps in modals
    - _Requirements: All_

  - [ ] 32.3 Add skip links for navigation
    - Add "Skip to main content" link
    - Add "Skip to editor" link
    - Add "Skip to file tree" link
    - _Requirements: All_

  - [ ]* 32.4 Run accessibility audit
    - Use axe-core for automated testing
    - Test with screen readers
    - Test keyboard-only navigation
    - Fix any issues found
    - _Requirements: All_

- [ ] 33. Performance optimization
  - [ ] 33.1 Implement code splitting
    - Lazy load Monaco editor
    - Lazy load settings sections
    - Lazy load modals
    - _Requirements: All_

  - [ ] 33.2 Implement virtualization
    - Virtualize project list with react-window
    - Virtualize file tree for large projects
    - Virtualize chat messages
    - _Requirements: 2.1, 3.1, 7.1_

  - [ ] 33.3 Optimize WebSocket message handling
    - Throttle cursor position updates (max 10/sec)
    - Debounce file change broadcasts (100ms)
    - Batch multiple operations
    - _Requirements: 6.3, 6.5_

  - [ ] 33.4 Implement caching strategies
    - Cache file contents in IndexedDB
    - Cache project metadata
    - Implement stale-while-revalidate for API calls
    - _Requirements: All_

  - [ ]* 33.5 Run performance tests
    - Test initial load time (< 2s)
    - Test time to interactive (< 3s)
    - Test editor typing latency (< 50ms)
    - Test with 100+ projects, 50+ tabs, 10+ collaborators
    - _Requirements: All_

- [ ] 34. Final checkpoint - All phases complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation at the end of each phase
- The implementation uses TypeScript with Next.js, React, Monaco Editor, xterm.js, and WebSocket
- All collaboration features require backend WebSocket server implementation (not covered in these tasks)
- Integration OAuth flows require backend API endpoints (not covered in these tasks)
