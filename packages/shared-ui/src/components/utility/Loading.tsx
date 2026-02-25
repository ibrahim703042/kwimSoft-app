import ClipLoader from "react-spinners/ClipLoader";

interface LoadingProps {
  loading: boolean;
  size?: number;
  color?: string;
}

export function Loading({ loading, size = 150, color = "#0F123F" }: LoadingProps) {
  return (
    <div>
      <ClipLoader
        loading={loading}
        size={size}
        color={color}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loading;
