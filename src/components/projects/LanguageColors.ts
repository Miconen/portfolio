export const getColor = (language: string ): string => {
    return LanguageColors.get(language); 
}

const LanguageColors = new Map<string, string>();
LanguageColors.set("default", "#3178c6");
LanguageColors.set("Lua", "#000080");
LanguageColors.set("C#", "#178600");
LanguageColors.set("JavaScript", "#f1e05a");
LanguageColors.set("C++", "#f34b7d");
LanguageColors.set("C", "#555555");
LanguageColors.set("TypeScript", "#3178c6");
LanguageColors.set("PHP", "#4F5D95");
LanguageColors.set("Go", "#00ADD8");
LanguageColors.set("SCSS", "#c6538c");
LanguageColors.set("CSS", "#563d7c");
LanguageColors.set("Shell", "#89e051");
LanguageColors.set("Astro", "#ff3e00");
LanguageColors.set("Svelte", "#ff5a03");
