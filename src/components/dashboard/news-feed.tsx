import { newsFeed } from "@/lib/data";

export function NewsFeed() {
  return (
    <div className="flex flex-col h-full justify-between space-y-12">
      {newsFeed.map((item) => (
        <div key={item.id}>
          <p className="text-sm font-medium leading-none">{item.headline}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {item.source} - {item.time}
          </p>
        </div>
      ))}
    </div>
  );
}
