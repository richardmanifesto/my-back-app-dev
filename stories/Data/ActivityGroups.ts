export const ActivityGroups = [
  {
    label       : "Sleep",
    activityType: "sleep",
    suffix      : "hrs",
    fields: [
      {
        label       : "How long did you sleep for?",
        name        : "sleep_value",
        type        : "number",
        placeholder : "Enter",
        value       : null
      },
      {
        label       : "How did you sleep",
        name        : "sleep_quality",
        type        : "range",
        bounds: {
          max: { value: 10, label: "like a dream" },
          min: { value: 0,  label: "terribly" }
        }
      }
    ]
  },
  {
    label       : "Exercises",
    activityType: "exercise",
    suffix      : "",
    fields: [
      {
        label       : "Have you done your exercises",
        name        : "exercise_value",
        type        : "select",
        value       : null,
        options     : [
          {value: "No", label: "No"},
          {value: "Yes", label: "Yes"}
        ]
      },
      {
        label       : "How are you finding your exercises",
        name        : "exercise_quality",
        type        : "range",
        value       : 5,
        bounds: {
          max: { value: 10, label: "great" },
          min: { value: 0,  label: "hard to manage" }
        }

      }
    ]
  },
  {
    label       : "Sitting",
    activityType: "sitting",
    suffix      : "hrs",
    fields: [
      {
        label       : "Have you much time did you spend sitting",
        name        : "sitting_value",
        type        : "number",
        placeholder : "Enter",
        value       : null
      },
      {
        label       : "How does it feel to sit",
        name        : "sitting_quality",
        type        : "range",
        value       : 5,
        bounds: {
          max: { value: 12, label: "great" },
          min: { value: 0,  label: "Uncomfortable" }
        }

      }
    ]
  },
  {
    label       : "Steps",
    activityType: "steps",
    suffix      : "",
    fields: [
      {
        label       : "How many steps have done today?",
        name        : "steps_value",
        type        : "number",
        placeholder : "Enter",
        value       : null
      },
      {
        label       : "How does it feel to walk",
        name        : "steps_quality",
        type        : "range",
        value       : 5,
        bounds: {
          max: { value: 12, label: "easy" },
          min: { value: 0,  label: "challenging" }
        }

      }
    ]
  }
]