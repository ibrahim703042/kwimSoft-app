import ClipLoader from "react-spinners/ClipLoader";

interface LoadingProps {
    loading: boolean;
}

export default function Loading({ loading }: LoadingProps) {
    return (
        <div>
            <ClipLoader
                loading={loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}
