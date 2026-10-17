export function materialRequest(subject: string, introduction: string, modeling = false) {
  const body = `Hi Can,\n\n${introduction}\n\nName:\nOrganization / Institution:\n${modeling ? "Project of interest:\n" : ""}Materials requested:\nPurpose / intended use:\n\nThank you.`;
  return `mailto:tancan872@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const consumerRequest = materialRequest(
  "Request for Recreational Fisheries Research Materials",
  "I am contacting you regarding the Recreational Fisheries Consumer Research project on your portfolio.",
);

export const modelingRequest = materialRequest(
  "Request for Mathematical Modeling Portfolio Materials",
  "I am contacting you regarding the “Empirical Modeling Across Complex Real-World Scenarios” portfolio.",
  true,
);

export const citrusRequest = materialRequest(
  "Request for Citrus Guardian Project Materials",
  "I am contacting you regarding the AI-Enabled Citrus Psyllid Monitoring & Treatment System on your portfolio.",
);
