import "./blog.css";
import { useAuth } from "../../../contexts/AuthContext";

import Header from "./components/Header";
import Conteudo from "./components/Conteudo";
import PostComposer from "./components/Postagem";

export default function Blog() {
  const { user } = useAuth();

  return (
    <section id="comunidade" className="comunidade">
      <Header />

      {user && <PostComposer />}

      <Conteudo />
    </section>
  );
}