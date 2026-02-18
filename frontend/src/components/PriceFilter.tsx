type Props = {
  selectedPrice: number;
  onChange: (value?: number) => void;
};
const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        value={selectedPrice}
        className="p-2 border rounded-md w-full"
        onChange={(event) =>
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined,
          )
        }
      >
        <option value="">Select max price</option>
        {[50, 100, 150, 200, 250, 300].map((data) => (
          <option value={data}>{data}</option>
        ))}
      </select>
    </div>
  );
};

export default PriceFilter;
