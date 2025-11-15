export type RepairItem = {
  id: string;
  titleKey: string;
  summaryKey: string;
  promptsKeys?: string[];
   exerciseKeys?: string[];
  required?: boolean;
   estimatedMin?: number;
};


export const REPAIR_FLOW: RepairItem[] = [
  {
    id: "pause",
    titleKey: "repair.steps.pause.title",
    summaryKey: "repair.steps.pause.summary",
    promptsKeys: ["repair.steps.pause.prompts"],
    required: true,
    estimatedMin: 2,
  },
  {
    id: "facts",
    titleKey: "repair.steps.facts.title",
    summaryKey: "repair.steps.facts.summary",
    promptsKeys: [
      "repair.steps.facts.promptsParent",
      "repair.steps.facts.promptsChild",
    ],
    required: true,
    estimatedMin: 4,
  },
  {
    id: "feelings",
    titleKey: "repair.steps.feelings.title",
    summaryKey: "repair.steps.feelings.summary",
    promptsKeys: [
      "repair.steps.feelings.promptsParent",
      "repair.steps.feelings.promptsChild",
    ],
    required: true,
    estimatedMin: 4,
  },
  {
    id: "impact",
    titleKey: "repair.steps.impact.title",
    summaryKey: "repair.steps.impact.summary",
    promptsKeys: ["repair.steps.impact.prompts"],
    required: true,
    estimatedMin: 3,
  },
  {
    id: "amends",
    titleKey: "repair.steps.amends.title",
    summaryKey: "repair.steps.amends.summary",
    exerciseKeys: ["repair.steps.amends.exercises"],
    required: true,
    estimatedMin: 5,
  },
  {
    id: "plan",
    titleKey: "repair.steps.plan.title",
    summaryKey: "repair.steps.plan.summary",
    promptsKeys: ["repair.steps.plan.prompts"],
    required: true,
    estimatedMin: 3,
  },
  {
    id: "appreciation",
    titleKey: "repair.steps.appreciation.title",
    summaryKey: "repair.steps.appreciation.summary",
    promptsKeys: ["repair.steps.appreciation.prompts"],
    required: true,
    estimatedMin: 1,
  },
  {
    id: "followup",
    titleKey: "repair.steps.followup.title",
    summaryKey: "repair.steps.followup.summary",
    promptsKeys: ["repair.steps.followup.prompts"],
    required: false,
    estimatedMin: 1,
  },
];


export const REQUIRED_REPAIR_COUNT = REPAIR_FLOW.filter(
  (s) => s.required
).length;
