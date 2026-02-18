import { hotelFacilities } from "../config/hotel-option-config";

type Props = {
  selectedFacilities: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Facility</h4>
      {hotelFacilities.map((data) => (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded"
            value={data}
            checked={selectedFacilities.includes(data)}
            onChange={onChange}
          />
          <span>{data}</span>
        </label>
      ))}
    </div>
  );
};
export default FacilitiesFilter;
