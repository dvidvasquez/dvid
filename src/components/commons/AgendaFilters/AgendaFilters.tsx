import { ActionButton } from "@/components/commons/ActionButton";
import { Panel } from "@/components/commons/Panel";
import { SegmentedControl } from "@/components/commons/SegmentedControl";
import { EVENT_CATEGORIES, QUICK_RANGES, type QuickRangeId } from "@/constants/events";
import type { DayRange, EventCategory } from "@/types/event";
import { countActiveFilters } from "@/utils/countActiveFilters";
import { NO_EVENT_FILTERS, type EventFilters } from "@/utils/filterEvents";
import styles from "./AgendaFilters.module.scss";

export type RangeMode = QuickRangeId | "custom";

type AgendaFiltersProps = {
  mode: RangeMode;
  range: DayRange;
  /** Primer y ultimo dia que se puede elegir en los campos de fecha. */
  minDay: string;
  maxDay: string;
  filters: EventFilters;
  /** Solo se ofrecen los municipios y categorias que aparecen en los eventos. */
  municipalities: string[];
  categories: EventCategory[];
  onQuickChange: (id: QuickRangeId) => void;
  onFromChange: (day: string) => void;
  onToChange: (day: string) => void;
  onFiltersChange: (filters: EventFilters) => void;
};

export function AgendaFilters({
  mode,
  range,
  minDay,
  maxDay,
  filters,
  municipalities,
  categories,
  onQuickChange,
  onFromChange,
  onToChange,
  onFiltersChange,
}: AgendaFiltersProps) {
  const active = countActiveFilters(filters);
  const toggleCategory = (id: EventCategory) =>
    onFiltersChange({
      ...filters,
      categories: filters.categories.includes(id) ? filters.categories.filter((item) => item !== id) : [...filters.categories, id],
    });

  return (
    <Panel title="¿Cuándo?">
      <div className={styles.body}>
        <div className={styles.quick}>
          <SegmentedControl
            label="Atajos de fecha"
            options={QUICK_RANGES}
            value={mode}
            onChange={(value) => value !== "custom" && onQuickChange(value)}
          />
        </div>

        <div className={styles.dates}>
          <label className={styles.field}>
            <span className={styles.label}>Desde</span>
            <input
              type="date"
              className={styles.input}
              value={range.from}
              min={minDay}
              max={maxDay}
              onChange={(event) => onFromChange(event.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Hasta</span>
            <input
              type="date"
              className={styles.input}
              value={range.to}
              min={minDay}
              max={maxDay}
              onChange={(event) => onToChange(event.target.value)}
            />
          </label>
        </div>

        <details className={styles.filters}>
          <summary className={styles.summary}>
            Filtros
            {active > 0 && <span className={styles.activeCount}>{active}</span>}
          </summary>

          <div className={styles.fields}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.label}>Tipo de evento</legend>
              <div className={styles.chips}>
                {EVENT_CATEGORIES.filter(({ id }) => categories.includes(id)).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    className={styles.chip}
                    data-category={id}
                    aria-pressed={filters.categories.includes(id)}
                    onClick={() => toggleCategory(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className={styles.field}>
              <span className={styles.label}>Municipio</span>
              <select
                className={styles.input}
                value={filters.municipality}
                onChange={(event) => onFiltersChange({ ...filters, municipality: event.target.value })}
              >
                <option value="">Todos</option>
                {municipalities.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Buscar</span>
              <input
                type="search"
                className={styles.input}
                placeholder="Banda, sitio, festival…"
                value={filters.query}
                onChange={(event) => onFiltersChange({ ...filters, query: event.target.value })}
              />
            </label>

            <label className={styles.check}>
              <input
                type="checkbox"
                checked={filters.freeOnly}
                onChange={(event) => onFiltersChange({ ...filters, freeOnly: event.target.checked })}
              />
              Solo gratis
            </label>

            {active > 0 && <ActionButton onClick={() => onFiltersChange(NO_EVENT_FILTERS)}>Quitar filtros</ActionButton>}
          </div>
        </details>
      </div>
    </Panel>
  );
}
