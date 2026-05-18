import { getHomepageSections } from "@/services/homepage";
import { HomepageSectionRenderer } from "./components/section-renderer";

export async function HomepageView() {
  const sections = await getHomepageSections();

  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <HomepageSectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
