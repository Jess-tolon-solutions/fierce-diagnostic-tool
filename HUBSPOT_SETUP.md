# HubSpot Setup — Fierce Diagnostic

This is the exact configuration to set up in HubSpot so the Fierce Diagnostic creates a Contact on every submission. Do these steps in order. Should take ~20 minutes.

## Step 1 — Create the 10 custom Contact properties

In HubSpot, go to **Settings → Properties → Contact properties → Create property**. Create each property below using the exact **Internal name** shown (HubSpot uses this in the API).

> Standard contact properties — `email`, `firstname`, `lastname`, `company`, `jobtitle` — already exist in every portal. You do **not** need to create those.

| # | Label | Internal name | Field type | Description / options |
|---|---|---|---|---|
| 1 | Team Size (Workshop) | `fierce_diag_team_size` | **Dropdown select** | Options exactly: `1–10`, `11–25`, `26–50`, `51–100`, `101–250`, `250+`, `Whole org`, `Not sure yet` |
| 2 | Recommended Module — Primary | `fierce_diag_recommended_module` | **Dropdown select** | Options exactly: `Fierce Confront`, `Fierce Accountability`, `Fierce Team`, `Fierce Coach`, `Fierce Delegate`, `Fierce Feedback` |
| 3 | Recommended Modules — Additional | `fierce_diag_modules_additional` | **Single-line text** | Comma-separated list of additional modules they flagged (priority order). |
| 4 | Pain Themes (Diagnostic) | `fierce_diag_pain_themes` | **Single-line text** | Comma-separated tags extracted from free-text answers (e.g., "Burnout / overwork, Feedback culture"). |
| 5 | Urgency Tier (Diagnostic) | `fierce_diag_urgency` | **Dropdown select** | Options exactly: `high`, `medium`, `low` (lowercase). |
| 6 | Q1 — Unspoken Conversation | `fierce_diag_unspoken` | **Multi-line text** | The free-text answer to "What's the conversation your team is NOT having right now?" |
| 7 | Q3 — What Changed | `fierce_diag_what_changed` | **Multi-line text** | The free-text answer to "What changed in the last 6 months that has you exploring training now?" |
| 8 | Preferred Workshop Window | `fierce_diag_preferred_window` | **Dropdown select** | Options exactly: `Next 2 weeks`, `This month`, `Next month`, `This quarter`, `Next quarter`, `Flexible` |
| 9 | Additional Notes (Diagnostic) | `fierce_diag_notes` | **Multi-line text** | Anything else the prospect wanted the account manager to know. |
| 10 | Diagnostic Submitted At | `fierce_diag_submitted_at` | **Date picker** | ISO timestamp of submission. HubSpot will parse it as a datetime. |

**Critical:** the **Internal name** must match exactly — including the `fierce_diag_` prefix and underscores. The Label can be anything; only the internal name is used by the API.

## Step 2 — Create the form

1. In HubSpot, go to **Marketing → Forms → Create form**
2. Choose **Embedded form** as the type
3. Name it: **Fierce Diagnostic Submission**
4. Drag in these fields (in this order, top to bottom):
   - First name *(standard)*
   - Last name *(standard)*
   - Email *(standard)*
   - Company *(standard)*
   - Job title *(standard)*
   - Team Size (Workshop) — `fierce_diag_team_size`
   - Recommended Module — Primary — `fierce_diag_recommended_module`
   - Recommended Modules — Additional — `fierce_diag_modules_additional`
   - Pain Themes (Diagnostic) — `fierce_diag_pain_themes`
   - Urgency Tier (Diagnostic) — `fierce_diag_urgency`
   - Q1 — Unspoken Conversation — `fierce_diag_unspoken`
   - Q3 — What Changed — `fierce_diag_what_changed`
   - Preferred Workshop Window — `fierce_diag_preferred_window`
   - Additional Notes (Diagnostic) — `fierce_diag_notes`
   - Diagnostic Submitted At — `fierce_diag_submitted_at`
5. Mark **only Email** as required. The Forms API enforces this.
6. **Options tab:**
   - Set what happens after submit to **Show inline thank you message** with a placeholder (the prospect never sees it — they stay on our app)
   - Disable "Show 'Always create contact for new email address' message"
   - Disable any pre-submission consent checkboxes (GDPR/etc.) for now — we'll handle consent on our side if you need it later
7. **Publish** the form.

## Step 3 — Grab the IDs

Once published, the form has an **embed code** that contains two values we need:

```html
<script>
  hbspt.forms.create({
    portalId: "12345678",         ← HUBSPOT_PORTAL_ID
    formId: "abcd1234-ef56-..."   ← HUBSPOT_FORM_GUID
  });
</script>
```

Copy both values. Send them to whoever is deploying the app (or paste them into `.env.local` if you're testing locally).

## Step 4 — Build the ops notification workflow

In HubSpot, go to **Automation → Workflows → Create workflow → Contact-based**.

1. **Enrollment trigger:** "Contact has filled out form" → choose **Fierce Diagnostic Submission**
2. **Action 1 — Send internal email:**
   - To: `fierceoperations@fierceinc.com`
   - Subject: `New Fierce Diagnostic — {{ contact.company }} — {{ contact.fierce_diag_recommended_module }}`
   - Body (suggested template):

```
A new Fierce Diagnostic has been submitted.

CONTACT
  Name:    {{ contact.firstname }} {{ contact.lastname }}
  Email:   {{ contact.email }}
  Company: {{ contact.company }}
  Role:    {{ contact.jobtitle }}
  Team:    {{ contact.fierce_diag_team_size }}

RECOMMENDATION (prospect did not see this)
  Primary module:    {{ contact.fierce_diag_recommended_module }}
  Also flagged:      {{ contact.fierce_diag_modules_additional }}
  Urgency:           {{ contact.fierce_diag_urgency }}
  Pain themes:       {{ contact.fierce_diag_pain_themes }}

THEIR WORDS
  Q1 (unspoken):     {{ contact.fierce_diag_unspoken }}
  Q3 (what changed): {{ contact.fierce_diag_what_changed }}

LOGISTICS
  Format:            On-site (in-person — campaign default)
  Window:            {{ contact.fierce_diag_preferred_window }}
  Notes:             {{ contact.fierce_diag_notes }}

Open the contact in HubSpot: {{ contact.hs_object_id_url }}
```

3. **Action 2 (optional) — Assign account manager:** If you have AMs in HubSpot users, add a "Set contact owner" action with rotation or assignment logic.
4. **Action 3 (optional) — Add to a list / set lifecycle stage:** e.g., set lifecycle to "Marketing Qualified Lead" so it shows in your standard MQL views.
5. **Publish** the workflow.

## Step 5 — Test end-to-end

Once the IDs are in env vars and the app is deployed:

1. Open the diagnostic, run through it with a real-looking test prospect (e.g., your own email + a recognizable company name like "TEST — Fierce Diagnostic")
2. Submit
3. Within ~30 seconds, the contact should appear in HubSpot **Contacts → Recent activity**
4. Within ~1 minute, the ops email should land in `fierceoperations@fierceinc.com`
5. Verify all 10 custom properties are populated correctly on the contact

If a property is blank, the most common cause is a typo in the Internal name — check it matches the table in Step 1 exactly.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Submission returns 500 in browser | HubSpot API rejected the payload | Check Vercel function logs for the exact error. Usually a field internal-name typo or a dropdown value that doesn't match the configured options. |
| Contact created but custom fields empty | Internal name mismatch between code and HubSpot | Compare property internal names in HubSpot to the table above |
| Ops email never arrives | Workflow not triggering | Check the workflow's "Enrollment history" tab. Make sure the form is correctly selected in the trigger. |
| Duplicate contacts created | Email field empty or malformed | HubSpot uses email as the unique key. Form validates email format on our side, so this should be rare. |

## What we capture vs. what we don't

✓ Captured: name, email, company, role, team size, full diagnostic answers, recommended module + alternates, pain themes, urgency, timing, notes.

✗ Not captured (intentionally): IP address, browser fingerprint, marketing consent. If you need any of these for compliance, let your dev know and we'll add them.
