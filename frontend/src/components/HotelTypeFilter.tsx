import { hotelTypes } from "../config/hotel-option-config";
type Props = {
  selectedHotelsType: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
const HotelTypeFilter = ({ selectedHotelsType, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Hotel Type</h4>
      {hotelTypes.map((data) => (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded"
            value={data}
            checked={selectedHotelsType.includes(data)}
            onChange={onChange}
          />
          <span>{data}</span>
        </label>
      ))}
    </div>
  );
};

export default HotelTypeFilter;
