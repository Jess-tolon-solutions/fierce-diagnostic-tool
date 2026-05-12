import type { FullSubmission, ModuleId } from "./types";

const MODULE_DISPLAY_NAMES: Record<ModuleId, string> = {
  confront: "Fierce Confront",
  accountability: "Fierce Accountability",
  team: "Fierce Team",
  coach: "Fierce Coach",
  delegate: "Fierce Delegate",
  feedback: "Fierce Feedback",
};

export interface HubSpotResult {
  configured: boolean;
  ok: boolean;
  error?: string;
}

export async function submitToHubSpot(
  sub: FullSubmission
): Promise<HubSpotResult> {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = process.env.HUBSPOT_FORM_GUID;

  if (!portalId || !formGuid) {
    return { configured: false, ok: true };
  }

  const [firstname, ...lastnameParts] = sub.context.name.trim().split(/\s+/);
  const lastname = lastnameParts.join(" ");

  const primaryModuleId = sub.result.recommendedModules[0];
  const additionalModuleNames = sub.result.recommendedModules
    .slice(1)
    .map((id) => MODULE_DISPLAY_NAMES[id])
    .filter(Boolean)
    .join(", ");

  const unspoken =
    typeof sub.answers.unspoken === "string" ? sub.answers.unspoken : "";
  const whatChanged =
    typeof sub.answers.what_changed === "string"
      ? sub.answers.what_changed
      : "";

  const fields = [
    field("email", sub.context.email),
    field("firstname", firstname || ""),
    field("lastname", lastname || ""),
    field("company", sub.context.company),
    field("jobtitle", sub.context.role),
    field("fierce_diag_team_size", sub.context.teamSize),
    field(
      "fierce_diag_recommended_module",
      MODULE_DISPLAY_NAMES[primaryModuleId] ?? ""
    ),
    field("fierce_diag_modules_additional", additionalModuleNames),
    field("fierce_diag_pain_themes", sub.result.painThemes.join(", ")),
    field("fierce_diag_urgency", sub.result.urgencyTier),
    field("fierce_diag_unspoken", unspoken),
    field("fierce_diag_what_changed", whatChanged),
    field("fierce_diag_preferred_window", sub.scope.preferredWindow),
    field("fierce_diag_notes", sub.scope.notes),
    field("fierce_diag_submitted_at", sub.submittedAt),
  ];

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: {
          pageName: "Fierce Diagnostic",
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return {
        configured: true,
        ok: false,
        error: `HubSpot returned ${res.status}: ${errorText.slice(0, 500)}`,
      };
    }

    return { configured: true, ok: true };
  } catch (err) {
    return {
      configured: true,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function field(name: string, value: string) {
  return { objectTypeId: "0-1", name, value };
}
