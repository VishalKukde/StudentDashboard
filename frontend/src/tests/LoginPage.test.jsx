import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ login: vi.fn(), user: null, loading: false })
}));

describe("LoginPage", () => {
  it("renders login form", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
