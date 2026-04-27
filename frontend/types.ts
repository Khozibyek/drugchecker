// app/types.ts

// Эмийн хайлтын үр дүн
export type Drug = {
  drug_id: string;
  drug_mn: string;
  drug_inn: string;
};

export type Severity = "MAJOR" | "MODERATE" | "MINOR" | "UNKNOWN";

// Харилцан үйлчлэл шалгасны үр дүн
export type InteractionResult =
  | {
      type: "interaction";
      has_interaction: true;
      severity: Severity;
      matched_keyword: string | null;
      description_mn: string;
      description_en: string;

      drug_a_id: string;
      drug_a_inn: string;
      drug_a_mn: string;

      drug_b_id: string;
      drug_b_inn: string;
      drug_b_mn: string;
    }
  | {
      type: "no_interaction";
      has_interaction: false;
      message: string;
      drug_a_mn: string;
      drug_b_mn: string;
    }
  | {
      type: "error";
      error: string;
    };

// Хэрэглэгчийн мэдээлэл
export type UserItem = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
};

// Шалгалтын түүх
export type HistoryItem = {
  id: number;
  drug_a_mn: string;
  drug_a_inn: string;
  drug_b_mn: string;
  drug_b_inn: string;
  severity: string;
  description_mn: string;
  description_en: string;
  created_at: string;
};
