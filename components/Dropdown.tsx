'use client';

import styles from '@/styles/components/Dropdown.module.scss';
import { useState } from 'react';
import { TbCheck, TbChevronDown } from 'react-icons/tb';

type DropdownProps<T> = {
  options: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  value: T | T[] | null;
  setValue: (value: T | T[] | null) => void;
  multiple?: boolean;
  placeholder?: string;
  width: number;
  forcePlaceholder?: boolean;
  checkmarks?: boolean;
};

function Dropdown<T>({
  options,
  value,
  setValue,
  labelKey,
  valueKey,
  width,
  placeholder,
  forcePlaceholder,
  checkmarks,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen(!open);
  }

  function selectOption(opt: T) {
    let newValue = value;

    if (Array.isArray(newValue)) {
      if (newValue.includes(opt)) {
        newValue.splice(newValue.indexOf(opt), 1);
      } else {
        newValue.push(opt);
      }
    } else {
      if (newValue === opt) {
        newValue = null;
      } else {
        newValue = opt;
      }
    }

    setValue(newValue);
  }

  return (
    <div
      className={`${styles.dropdown} ${open ? styles.open : ''}`}
      style={{ width: `${width}px` }}
    >
      <div className={styles.selected} onClick={toggleOpen}>
        {forcePlaceholder ||
        (Array.isArray(value) && value.length === 0) ||
        value === null ? (
          placeholder
        ) : Array.isArray(value) ? (
          value.map((v) => (
            <div key={v[valueKey] as string}>{v[labelKey] as string}</div>
          ))
        ) : (
          <div>{value[labelKey] as string}</div>
        )}
        <span className={styles.chevron}>
          <TbChevronDown size={22} />
        </span>
      </div>
      <ul className={styles.options}>
        {options.map((opt) => (
          <li
            key={opt[valueKey] as string}
            className={
              (Array.isArray(value) && value.includes(opt)) || value === opt
                ? styles.active
                : ''
            }
            onClick={() => selectOption(opt)}
          >
            {opt[labelKey] as string}
            {checkmarks &&
            ((Array.isArray(value) && value.includes(opt)) || value === opt) ? (
              <span>
                <TbCheck size={14} />
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Dropdown };
