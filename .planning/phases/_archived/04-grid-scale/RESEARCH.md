# Phase 04: Grid Scale - Secondary Pages Responsive

**Generated:** 2026-01-27
**Research Type:** Comprehensive, Production-Grade
**Quality Standard:** Bulletproof, Zero-Compromise

---

## Executive Summary

### Current State Audit

| Page | Desktop Status | Mobile Status | Critical Issues | Grade |
|------|----------------|---------------|-----------------|-------|
| Call Logs | Working | BROKEN | `w-96` detail panel, no mobile layout | D |
| Voice Agents | Working | Partial | List okay, detail needs work | C+ |
| Phone Numbers | Working | Partial | Table needs card view | C |
| Documents | Working | Partial | Drag-drop not mobile-friendly | C |
| Processing | Working | Good | Minor tweaks needed | B |
| Data | Working | Partial | Table view issues | C |
| Settings | Working | BROKEN | `w-64` secondary sidebar breaks | D |
| Contacts | Working | BROKEN | Table unusable on mobile | D |

### Critical Findings

**Call Logs Page - Detail Panel:**
```tsx
// CURRENT (BROKEN)
<div className="w-96 bg-white">  // 384px fixed width

// On 375px screen: Panel wider than screen = horizontal scroll
```

**Settings Page - Secondary Sidebar:**
```tsx
// CURRENT (BROKEN)
<div className="w-64 bg-white">  // 256px fixed sidebar

// On mobile: Sidebar takes 68% of screen, content squeezed
```

**Contacts Page - Table:**
```tsx
// CURRENT (BROKEN)
<table className="min-w-full">
  <thead>
    <tr>
      <th>Name</th>
      <th>Phone</th>
      <th>Channel</th>
      <th>Lifecycle</th>
      <th>Last Contact</th>
      <th>Actions</th>
    </tr>
  </thead>
```
6 columns minimum = horizontal scroll nightmare on mobile

---

## Non-Negotiable Objectives

### What Success Looks Like

1. **Every page usable on iPhone SE (320px)** - No horizontal scroll, all features accessible
2. **Tables become cards on mobile** - Scannable, touch-friendly
3. **Settings navigable via tabs** - No sidebar on mobile
4. **Call transcripts readable** - Full-width on mobile
5. **Document upload works via tap** - No drag-drop dependency
6. **Voice agents manageable** - List/detail pattern consistent with Agents page
7. **Pattern consistency** - Same mobile patterns as Phase 03

### Measurable Acceptance Criteria

| Page | Metric | Target |
|------|--------|--------|
| Call Logs | Transcript readable on 320px | Yes |
| Settings | All settings accessible | Yes |
| Contacts | Contact findable in < 3 taps | Yes |
| Documents | Upload success on mobile | 100% |
| All | Touch targets | 44px minimum |
| All | Horizontal scroll | None |

---

## Hard Boundaries

### Included (In Scope)

1. **Voice Agents Section**
   - `/voice-agents` - List responsive
   - `/call-logs` - Full mobile redesign (list + transcript)
   - `/phone-numbers` - Table → card view

2. **Document Intelligence Section**
   - `/documents` - Upload UI mobile-friendly
   - `/processing` - Queue list responsive
   - `/data` - Table → card view

3. **Settings Page**
   - Secondary nav → tab pattern on mobile
   - All forms responsive
   - Toggle/switch touch-friendly

4. **Contacts Page**
   - Table → card view on mobile
   - Search/filter mobile-friendly
   - Contact detail responsive

### Explicitly Excluded (Out of Scope)

| Item | Reason | Deferred To |
|------|--------|-------------|
| New features | Scope creep | v5.0 |
| Audio playback redesign | Feature work | v5.0 |
| Advanced filtering UI | Feature work | v5.0 |
| Batch operations mobile | Complex feature | v5.0 |
| Drag-drop mobile | Technical limitation | N/A |

---

## Best-Practice Approach

### 1. Call Logs Mobile Pattern

**Current Architecture:**
```
Desktop: [List (flex-1)] [Detail (w-96)]
Mobile:  ???
```

**Target Architecture:**
```
Mobile:
├── List View (default)
│   ├── Call card with preview
│   ├── Status badge
│   └── Duration/time
│
└── Detail View (on select)
    ├── Header with back button
    ├── Call metadata
    ├── Full transcription (scrollable)
    ├── Timeline
    └── Action buttons (sticky bottom)
```

**Implementation:**

```tsx
// call-logs/page.tsx
export default function CallLogsPage() {
  const [selectedCall, setSelectedCall] = useState(null);

  return (
    <div className="flex h-full">
      {/* List - hidden on mobile when call selected */}
      <div className={cn(
        "flex-1 overflow-y-auto",
        selectedCall && "hidden tablet:flex"
      )}>
        <CallLogFilters />
        <CallLogList
          onSelect={setSelectedCall}
          selectedId={selectedCall?.id}
        />
      </div>

      {/* Detail - full screen on mobile */}
      {selectedCall && (
        <div className={cn(
          "fixed inset-0 z-40 bg-white dark:bg-slate-900",
          "tablet:relative tablet:w-96 tablet:flex-shrink-0",
          "tablet:border-l tablet:z-auto tablet:inset-auto"
        )}>
          <CallLogDetail
            call={selectedCall}
            onBack={() => setSelectedCall(null)}
          />
        </div>
      )}
    </div>
  );
}
```

**Transcription Mobile Layout:**
```tsx
// Full-width transcription cards
<div className="space-y-3 p-4">
  {transcription.map((line, idx) => (
    <div
      key={idx}
      className={cn(
        "p-4 rounded-xl",
        line.speaker === 'Agent'
          ? "bg-teal-50 border-l-4 border-teal-500"
          : "bg-gray-50"
      )}
    >
      <span className="text-xs font-bold uppercase mb-1 block">
        {line.speaker === 'Agent' ? '🎙️ Agent' : '👤 Caller'}
      </span>
      <p className="text-sm leading-relaxed">{line.text}</p>
    </div>
  ))}
</div>
```

### 2. Settings Tab Pattern for Mobile

**Current Architecture:**
```
Desktop: [Sidebar w-64] [Content flex-1]
```

**Target Architecture:**
```
Mobile:
┌─────────────────────────────────────┐
│ Settings                            │
├─────────────────────────────────────┤
│ [Users] [Team] [Channels] [Life...] │  ← Scrollable tabs
├─────────────────────────────────────┤
│                                     │
│           TAB CONTENT               │
│                                     │
└─────────────────────────────────────┘

Desktop: Keep current sidebar pattern
```

**Implementation:**

```tsx
// settings/page.tsx
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="flex flex-col tablet:flex-row h-full">
      {/* Mobile: Tab bar at top */}
      <div className="tablet:hidden border-b border-gray-200 dark:border-slate-700">
        <div className="flex overflow-x-auto p-2 gap-2 no-scrollbar">
          {settingsNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "px-4 py-2 rounded-lg whitespace-nowrap font-bold text-sm",
                "min-h-[44px]",  // Touch target
                activeTab === item.id
                  ? "bg-gradient-to-r from-primary to-accent text-white"
                  : "bg-gray-100 dark:bg-slate-700"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Sidebar */}
      <div className="hidden tablet:flex w-64 flex-shrink-0 border-r">
        <SettingsSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 tablet:p-8">
        {activeTab === 'users' && <UsersSettings />}
        {activeTab === 'team' && <TeamSettings />}
        {activeTab === 'channels' && <ChannelsSettings />}
        {activeTab === 'lifecycle' && <LifecycleSettings />}
      </div>
    </div>
  );
}
```

**Hide scrollbar but keep functionality:**
```css
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
```

### 3. Contacts Table → Card Pattern

**Current (Broken):**
```
| Name | Phone | Channel | Lifecycle | Last Contact | Actions |
```

**Mobile Card Design:**
```
┌─────────────────────────────────────────────┐
│ [Avatar] John Smith                    [⋮]  │
│          +1-555-0123                        │
│          ─────────────────────────────────  │
│          [WhatsApp] [Lead] · 2 days ago     │
└─────────────────────────────────────────────┘
```

**Implementation:**

```tsx
// contacts/ContactList.tsx
export function ContactList({ contacts }) {
  return (
    <>
      {/* Desktop: Table */}
      <div className="hidden tablet:block">
        <ContactsTable contacts={contacts} />
      </div>

      {/* Mobile: Cards */}
      <div className="tablet:hidden space-y-3 p-4">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </>
  );
}

function ContactCard({ contact }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-slate-700">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
          {contact.name?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-dark dark:text-white truncate">
              {contact.name || 'Unknown'}
            </h3>
            <button className="p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
              <MoreVertical size={18} />
            </button>
          </div>
          <p className="text-sm text-text-secondary dark:text-slate-400">
            {contact.phone}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full font-bold">
              {contact.channel}
            </span>
            <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-bold">
              {contact.lifecycle}
            </span>
            <span className="text-xs text-text-secondary dark:text-slate-400">
              · {formatTimeAgo(contact.last_contact)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Document Upload Mobile

**Problem:** Drag-drop doesn't work on mobile

**Solution:** Large tap target with camera option

```tsx
// documents/UploadArea.tsx
export function UploadArea() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      {/* Main upload button - large touch target */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "w-full p-8 border-2 border-dashed border-gray-300 dark:border-slate-600",
          "rounded-2xl bg-gray-50 dark:bg-slate-800",
          "flex flex-col items-center justify-center gap-4",
          "min-h-[200px] tablet:min-h-[300px]",
          "hover:border-primary hover:bg-primary/5",
          "transition-all duration-300"
        )}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload size={32} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="font-bold text-dark dark:text-white">
            Tap to upload documents
          </p>
          <p className="text-sm text-text-secondary dark:text-slate-400 mt-1">
            PDF, PNG, JPG up to 10MB
          </p>
        </div>
      </button>

      {/* Quick actions for mobile */}
      <div className="grid grid-cols-2 gap-3 tablet:hidden">
        <button
          onClick={() => {
            fileInputRef.current?.setAttribute('capture', 'environment');
            fileInputRef.current?.click();
          }}
          className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 min-h-[56px]"
        >
          <Camera size={20} className="text-primary" />
          <span className="font-bold text-sm">Camera</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 min-h-[56px]"
        >
          <Folder size={20} className="text-primary" />
          <span className="font-bold text-sm">Files</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
```

### 5. Voice Agents List

**Pattern:** Consistent with AI Agents (Phase 03)

```tsx
// voice-agents/page.tsx - Same master-detail pattern
<div className="flex h-full">
  <div className={cn(
    "flex-1 tablet:w-80 tablet:flex-none",
    selectedAgent && "hidden tablet:flex"
  )}>
    <VoiceAgentList onSelect={setSelectedAgent} />
  </div>

  {selectedAgent && (
    <div className={cn(
      "fixed inset-0 z-40 tablet:relative tablet:flex-1",
      "bg-white dark:bg-slate-900"
    )}>
      <VoiceAgentDetail
        agent={selectedAgent}
        onBack={() => setSelectedAgent(null)}
      />
    </div>
  )}
</div>
```

### 6. Phone Numbers Table → Card

```tsx
function PhoneNumberCard({ number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono font-bold text-dark dark:text-white">
          {formatPhoneNumber(number.number)}
        </span>
        <span className={cn(
          "px-2 py-1 text-xs font-bold rounded-full",
          number.status === 'active'
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700"
        )}>
          {number.status}
        </span>
      </div>
      <div className="space-y-1 text-sm text-text-secondary dark:text-slate-400">
        <p>Agent: {number.assignedAgent || 'Unassigned'}</p>
        <p>Type: {number.type}</p>
      </div>
    </div>
  );
}
```

---

## Edge Cases & Failure Modes

### Critical Edge Cases

| Edge Case | Risk | Mitigation |
|-----------|------|------------|
| Long call transcript | Memory | Paginate or virtualize |
| Many contacts (1000+) | Performance | Virtual list |
| Settings form validation | UX | Inline errors |
| File upload fail | Data loss | Retry mechanism |
| Large queue (100+) | Performance | Pagination |
| Offline settings save | Data loss | Local storage backup |

### Platform-Specific Issues

| Platform | Issue | Solution |
|----------|-------|----------|
| iOS | File input camera | Use `capture` attribute |
| Android | Tab scroll | `overflow-x: auto` with momentum |
| iOS Safari | 100vh issue | Use `dvh` or JS fallback |

---

## Implementation Order & Dependencies

### Dependency Graph

```
Phase 03 (Core Pages) - patterns established
    │
    ▼
┌──────────────────────────────────────┐
│ Step 1: Shared Components            │
│ - MobileListDetail pattern           │
│ - CardList component                 │
│ - TabNavigation component            │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 2: Call Logs Overhaul           │
│ - Mobile list view                   │
│ - Full-screen transcript             │
│ - Sticky action buttons              │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 3: Settings Tab Pattern         │
│ - Mobile tab bar                     │
│ - Keep desktop sidebar               │
│ - Form responsiveness                │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 4: Contacts Card View           │
│ - ContactCard component              │
│ - Search mobile-friendly             │
│ - Filter mobile-friendly             │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 5: Documents Mobile             │
│ - Upload tap-to-select               │
│ - Camera option                      │
│ - Progress indicators                │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 6: Remaining Pages              │
│ - Voice Agents (follow pattern)      │
│ - Phone Numbers (card view)          │
│ - Processing queue                   │
│ - Data extraction view               │
└──────────────────────────────────────┘
```

### Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `src/app/(main)/call-logs/page.tsx` | Full mobile overhaul | P0 |
| `src/app/(main)/settings/page.tsx` | Tab pattern | P0 |
| `src/app/(main)/contacts/page.tsx` | Card view | P0 |
| `src/app/(main)/documents/page.tsx` | Upload mobile | P1 |
| `src/app/(main)/voice-agents/page.tsx` | Master-detail | P1 |
| `src/app/(main)/phone-numbers/page.tsx` | Card view | P1 |
| `src/app/(main)/processing/page.tsx` | Minor tweaks | P2 |
| `src/app/(main)/data/page.tsx` | Card view | P2 |

### New Components to Create

| Component | Purpose |
|-----------|---------|
| `src/components/ui/MobileTabBar.tsx` | Settings tab navigation |
| `src/components/ui/CardList.tsx` | Generic table→card wrapper |
| `src/components/contacts/ContactCard.tsx` | Contact card view |
| `src/components/call-logs/TranscriptView.tsx` | Full-screen transcript |
| `src/components/documents/MobileUpload.tsx` | Mobile upload UI |

---

## Cross-Phase Consistency

### Pattern Alignment

| Pattern | Phase 03 | Phase 04 |
|---------|----------|----------|
| Master-detail | Inbox, Agents | Call Logs, Voice Agents |
| Full-screen mobile | Chat, Agent detail | Transcript, Contact detail |
| Slide-in | Context panel | N/A |
| Card view | N/A | Contacts, Phone Numbers |
| Tab navigation | N/A | Settings |

### Design Token Compliance

All Phase 04 pages must use:
- `tablet:` breakpoint for split views
- `.touch-target` class for interactive elements
- `--spacing-*` tokens for consistent spacing
- Standard animation durations (300ms)

---

## Testing Protocol

### Page-Specific Tests

**Call Logs:**
1. List renders on mobile
2. Tap call → full-screen detail
3. Scroll transcript smoothly
4. Download button accessible
5. Back → returns to list

**Settings:**
1. Tab bar visible on mobile
2. Scroll tabs horizontally
3. Tap tab → content changes
4. Forms usable on mobile
5. Save works

**Contacts:**
1. Cards render on mobile
2. Search works
3. Tap contact → detail view
4. Edit/delete accessible

**Documents:**
1. Tap to upload works
2. Camera option works (iOS/Android)
3. Progress visible
4. File list readable

---

## Success Metrics

After Phase 04 completion:

| Page | Current | Target |
|------|---------|--------|
| Call Logs mobile usable | No | Yes |
| Settings mobile usable | No | Yes |
| Contacts mobile usable | No | Yes |
| Documents upload mobile | Partial | Yes |
| All pages horizontal scroll | Present | None |

---

## Sources & References

- [Table to Card Pattern - Smashing Magazine](https://www.smashingmagazine.com/2019/01/table-design-patterns-web/)
- [Responsive Tables - CSS-Tricks](https://css-tricks.com/responsive-data-tables/)
- [Mobile File Upload Patterns](https://www.nngroup.com/articles/mobile-subnavigation/)
- [Tab Bar vs Segmented Control](https://www.nngroup.com/articles/tabs-used-right/)
