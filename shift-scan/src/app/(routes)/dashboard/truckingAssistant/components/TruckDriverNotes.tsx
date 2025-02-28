import { updateTruckDrivingNotes } from "@/actions/truckingActions";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";

export default function TruckDriverNotes({
  truckingLog,
  notes,
  setNotes,
}: {
  truckingLog: string | undefined;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}) {
  const UpdateNotes = async () => {
    const formData = new FormData();
    formData.append("comment", notes ?? "");
    formData.append("id", truckingLog ?? "");
    await updateTruckDrivingNotes(formData);
  };
  return (
    <>
      <TextAreas
        name="notes"
        maxLength={40}
        value={notes}
        placeholder="Write your Notes here..."
        className="h-full w-full text-base focus:outline-none focus:ring-transparent focus:border-current "
        onChange={(e) => setNotes(e.target.value)}
        onBlur={(e) => UpdateNotes()}
      />
      <Texts
        size={"p2"}
        className={`absolute bottom-5 right-2 ${
          notes.length >= 40 ? " text-red-500" : ""
        }`}
      >
        {notes.length}/40
      </Texts>
    </>
  );
}
