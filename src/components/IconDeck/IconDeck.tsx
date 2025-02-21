import style from "./IconDeck.module.css";

type Props = {
  src: string;
  alt: string;
};

export default function IconDeck({ src, alt }: Readonly<Props>) {
  return <img src={src} alt={alt} className={style.symbol} />;
}
