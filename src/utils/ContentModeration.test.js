import {
  containsOffensiveContent,
  validateRespectfulContent,
} from "./ContentModeration";

describe("ContentModeration", () => {
  test.each(["cu", "cú", "c.u", "c u", "CU", "cuzão"])(
    "bloqueia a variação ofensiva %s",
    (text) => {
      expect(containsOffensiveContent(text)).toBe(true);
      expect(validateRespectfulContent(text).allowed).toBe(false);
    }
  );

  test.each([
    "A coleta aconteceu em Curitiba.",
    "Precisamos fortalecer a cultura da reciclagem.",
    "O atendimento foi educado e pontual.",
  ])("mantém textos legítimos: %s", (text) => {
    expect(containsOffensiveContent(text)).toBe(false);
    expect(validateRespectfulContent(text).allowed).toBe(true);
  });
});
