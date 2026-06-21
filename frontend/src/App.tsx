import { Outlet, Link } from "react-router-dom";

export const App = () => {
  return (
    <div>
      <header>
        <nav>
          <Link to={"/"}>Home</Link>
          <Link to={"/about"}>About</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>&copy; {new Date().getFullYear()}</footer>
    </div>
  );
};
