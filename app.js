"use strict";

// Replace this label with the alliance name, tag and state when supplied.
const allianceLabel = "GIR Invaders Grim";
document.querySelectorAll("[data-brand]").forEach(node => {
  node.textContent = allianceLabel;
});

const format = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2});
const amount = value => format.format(value);
const duration = minutes => {
  const total = Math.ceil(minutes);
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const remainder = total % 60;
  return [days && `${days}d`, hours && `${hours}h`, remainder && `${remainder}m`]
    .filter(Boolean).join(" ") || "0m";
};

const field = (name, label, {min = 0, max = 1e12, step = 1, value} = {}) =>
  ({name, label, min, max, step, value});

const calculators = [
  {
    title: "Research budget",
    description: "Add one research step per row using base values. Columns are wood, iron, electricity, coin, badges, and time in minutes. Example: 1000, 500, 300, 2000, 5, 120.",
    fields: [
      {name: "rows", label: "Research steps (six values per line)", multiline: true},
      field("speed", "Research speed bonus (%)", {step: 0.01, value: 0}),
      field("discount", "Reduction on wood, iron, electricity and coin (%)", {max: 100, step: 0.01, value: 0}),
      field("speedups", "Speedups available (minutes)", {value: 0})
    ],
    calculate({rows, speed, discount, speedups}) {
      const totals = [0, 0, 0, 0, 0, 0];
      for (const [index, row] of rows.trim().split(/\r?\n/).entries()) {
        if (!row.trim()) continue;
        const cells = row.split(",").map(cell => cell.trim());
        if (cells.length !== 6 || cells.some(cell => !/^\d+$/.test(cell) || Number(cell) > 1e12)) {
          throw new Error(girText`Line ${index + 1} needs six comma-separated whole numbers from 0 to 1 trillion.`);
        }
        cells.forEach((cell, column) => { totals[column] += Number(cell); });
      }
      const [wood, iron, electricity, coin, badges] = totals.map((total, column) =>
        column < 4 ? Math.ceil(total * (100 - discount) / 100) : total);
      const time = Math.ceil(totals[5] * 100 / (100 + speed));
      return girText`Estimated cost: ${amount(wood)} wood · ${amount(iron)} iron · ${amount(electricity)} electricity · ${amount(coin)} coin · ${amount(badges)} badges\nTime: ${duration(time)} · After speedups: ${duration(Math.max(0, time - speedups))}`;
    }
  },
  {
    title: "Resource goal",
    description: "Estimate how long it will take to reach a resource target at a steady rate, such as Dino Scales per hour.",
    fields: [
      field("owned", "In storage", {value: 0}), field("target", "Target amount"),
      field("rate", "Net gain per hour", {step: 0.01})
    ],
    calculate({owned, target, rate}) {
      const remaining = Math.max(0, target - owned);
      if (!remaining) return girText("Target reached.");
      if (!rate) return girText`${amount(remaining)} still needed. Add a positive rate for an ETA.`;
      return girText`${amount(remaining)} still needed · ETA ${duration(remaining * 60 / rate)}`;
    }
  },
  {
    title: "Weekly crystal estimate",
    description: "Add the expected payouts for holdings you plan to keep through settlement. Use the amount shown for this payout, including an active Abundant Effect where applicable.",
    fields: [
      field("regularCount", "Regular Mines", {value: 0}), field("regularPayout", "Crystals per regular Mine", {value: 0}),
      field("boostedCount", "Boosted Mines", {value: 0}), field("boostedPayout", "Crystals per boosted Mine", {value: 0}),
      field("passCount", "Passes", {value: 0}), field("passPayout", "Crystals per Pass", {value: 0})
    ],
    calculate({regularCount, regularPayout, boostedCount, boostedPayout, passCount, passPayout}) {
      const total = BigInt(regularCount) * BigInt(regularPayout)
        + BigInt(boostedCount) * BigInt(boostedPayout)
        + BigInt(passCount) * BigInt(passPayout);
      return girText`${amount(total)} estimated crystals at settlement.`;
    }
  },
  {
    title: "Mining Site capture",
    description: "Estimate remaining control time at a steady capture rate. The default full-capture time comes from the pre-release guide.",
    fields: [
      field("progress", "Current camp progress (%)", {max: 100, step: 0.01, value: 0}),
      field("full", "Full capture time (minutes)", {min: 0.1, step: 0.1, value: 30})
    ],
    calculate({progress, full}) {
      return girText`About ${duration(full * (100 - progress) / 100)} of further uninterrupted control.`;
    }
  },
  {
    title: "Speedup inventory",
    description: "Total your speedups and compare them with the in-game timer for a planned upgrade.",
    fields: [
      field("one", "1-minute items", {value: 0}), field("five", "5-minute items", {value: 0}),
      field("sixty", "1-hour items", {value: 0}), field("extra", "Other speedups (total minutes)", {value: 0}),
      field("timer", "Remaining upgrade timer (minutes)", {value: 0})
    ],
    calculate({one, five, sixty, extra, timer}) {
      const total = one + five * 5 + sixty * 60 + extra;
      return girText`Speedups available: ${duration(total)} · Still needed: ${duration(Math.max(0, timer - total))}`;
    }
  }
];

function createCalculator({title, description, fields, calculate}) {
  const form = document.createElement("form");
  const heading = document.createElement("h3");
  heading.textContent = title;
  const note = document.createElement("p");
  note.textContent = description;
  const inputs = document.createElement("div");
  inputs.className = "fields";

  for (const config of fields) {
    const label = document.createElement("label");
    label.textContent = config.label;
    const input = document.createElement(config.multiline ? "textarea" : "input");
    input.name = config.name;
    input.required = true;
    if (config.multiline) {
      label.className = "wide";
      input.rows = 3;
      input.maxLength = 12000;
    } else {
      input.type = "number";
      input.min = config.min;
      input.max = config.max;
      input.step = config.step;
      if (config.value !== undefined) input.value = config.value;
    }
    label.append(input);
    inputs.append(label);
  }

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Calculate";
  const output = document.createElement("output");
  output.setAttribute("aria-live", "polite");
  form.append(heading, note, inputs, button, output);
  form.addEventListener("input", () => { output.textContent = ""; });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const values = Object.fromEntries(fields.map(({name, multiline}) => {
      const input = form.elements.namedItem(name);
      return [name, multiline ? input.value : input.valueAsNumber];
    }));
    try {
      if (typeof values.rows === "string" && !values.rows.trim()) {
        throw new Error(girText("Enter at least one research step."));
      }
      output.textContent = calculate(values);
    } catch (error) {
      output.textContent = error.message;
    }
  });
  document.addEventListener("gir-language-change", () => { if (output.textContent) form.requestSubmit(); });
  return form;
}

document.querySelector("#calculator-list")?.append(...calculators.map(createCalculator));

