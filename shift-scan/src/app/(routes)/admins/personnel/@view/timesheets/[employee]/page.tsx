export default function Timesheets({
  params,
}: {
  params: { employee: string };
}) {
  return (
    <div>
      <h1>Timesheets for {params.employee}</h1>
    </div>
  );
}
