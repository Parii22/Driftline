export const STAGES = ["Discovery", "Consideration", "Action", "Friction Point"];
export const LS_KEY = 'driftline-workbench-v1';

export const seed = {
  active: 0,
  personas: [
    {
      name: "First-time Shopper",
      archetype: "Novice user",
      steps: [
        { label: "Lands on homepage", stage: "Discovery", s: 2 },
        { label: "Browses catalog", stage: "Discovery", s: 1 },
        { label: "Compares pricing", stage: "Consideration", s: -1 },
        { label: "Enters card details", stage: "Friction Point", s: -3 },
        { label: "Applies promo code", stage: "Action", s: 1 },
        { label: "Order confirmed", stage: "Action", s: 3 },
      ],
    },
    {
      name: "Returning Power User",
      archetype: "Tech-savvy",
      steps: [
        { label: "Opens saved cart", stage: "Discovery", s: 2 },
        { label: "One-click checkout", stage: "Action", s: 3 },
        { label: "Hits OTP delay", stage: "Friction Point", s: -2 },
        { label: "Payment succeeds", stage: "Action", s: 2 },
      ],
    },
  ],
};
