import CustomCard from "@/components/CustomCard";
import Li from "@/components/CustomLi";
import { transformListItems } from "@/utils/heptabaseFunction";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import CardContent from "./CardContent";

export default function CardComponent({
  content,
  cards,
}: {
  content: string;
  cards: Card[];
}) {
  const parsedContent = JSON.parse(content);
  const transformedContent = transformListItems(parsedContent.content);

  const genCardId = () => {
    return transformedContent.length > 0 ? transformedContent[0].attrs.id : "";
  };

  const htmlContent = content
    ? generateHTML(
        {
          type: "doc",
          content: transformedContent,
        },
        [
          StarterKit,
          CustomCard.configure({ cards }),
          Li,
          OrderedList.extend({
            name: "numbered_list_item",
          }),
          ListItem,
          BulletList.extend({
            name: "bullet_list_item",
          }),
        ]
      )
    : "";

  return (
    <div
      className="prose !max-w-[580px] max-h-screen w-[580px] overflow-y-auto p-4"
      data-card-id={genCardId()}
    >
      <CardContent cards={cards} htmlContent={htmlContent} />
    </div>
  );
}
