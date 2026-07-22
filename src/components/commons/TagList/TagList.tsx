import styles from "./TagList.module.scss";

type TagListProps = {
  items: string[];
};

export function TagList({ items }: TagListProps) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item} className={styles.chip}>
          {item}
        </li>
      ))}
    </ul>
  );
}
