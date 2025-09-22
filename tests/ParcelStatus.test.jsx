import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ParcelStatus from "../src/components/parcelStatus";

describe("ParcelStatus component", () => {
  it("shows loading initially", () => {
    render(<ParcelStatus />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows delivery status when parcel is loaded", async () => {
    render(<ParcelStatus parcelId={1} />);
    expect(await screen.findByText("Delivery Status")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows delivery status when parcel is loaded", async () => {
    render(<ParcelStatus parcelId={-1} />);
    expect(await screen.findByText("We experienced a problem loading your todo")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
 
});
