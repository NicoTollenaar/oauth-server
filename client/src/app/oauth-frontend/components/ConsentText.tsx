import { QueryObject } from "@/app/types/customTypes";

interface ConsentTextProps {
  queryObject: QueryObject;
}

export default function ConsentText({ queryObject }: ConsentTextProps) {
  return (
    <div className="flex flex-col w-[60%] justify-start gap-2 border-white">
      <h1 className="text-lg font-semibold">Application with clientID:</h1>
      <h1 className="text-orange-500 text-xl font-bold">
        {queryObject.client_id}
      </h1>
      <h1 className="text-lg font-semibold">
        is asking to access information with the following scope:
      </h1>
      <ul className="text-xl font-bold text-orange-500">
        {JSON.stringify(queryObject.scope)}
      </ul>
      <h1 className="text-xl font-bold">Do you consent?</h1>
    </div>
  );
}
