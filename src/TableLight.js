import classNames from 'classnames';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useBootstrapPrefix } from './ThemeProvider';

const propTypes = {
  fields: PropTypes.array,
  items: PropTypes.array,
  /**
   * @default 'table'
   */
  bsPrefix: PropTypes.string,

  /**
   * Adds zebra-striping to any table row within the `<tbody>`.
   */
  striped: PropTypes.bool,

  /**
   * Adds borders on all sides of the table and cells.
   */
  bordered: PropTypes.bool,

  /**
   * Removes all borders on the table and cells, including table header.
   */
  borderless: PropTypes.bool,

  /**
   * Enable a hover state on table rows within a `<tbody>`.
   */
  hover: PropTypes.bool,

  /**
   * Make tables more compact by cutting cell padding in half by setting
   * size as `sm`.
   */
  size: PropTypes.string,

  /**
   * Invert the colors of the table — with light text on dark backgrounds
   * by setting variant as `dark`.
   */
  variant: PropTypes.string,

  /**
   * Responsive tables allow tables to be scrolled horizontally with ease.
   * Across every breakpoint, use `responsive` for horizontally
   * scrolling tables. Responsive tables are wrapped automatically in a `div`.
   * Use `responsive="sm"`, `responsive="md"`, `responsive="lg"`, or
   * `responsive="xl"` as needed to create responsive tables up to
   * a particular breakpoint. From that breakpoint and up, the table will
   * behave normally and not scroll horizontally.
   */
  responsive: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
const titleCase = (s) => {
  return s
    .replace(/([^A-Z])([A-Z])/g, '$1 $2') // split cameCase
    .replace(/([A-Z][^A-Z])/g, ' $1') // split cameCase
    .replace(/[_-]+/g, ' ') // split snake_case and lisp-case
    .replace(/(^\w|\b\w)/g, (m) => m.toUpperCase())
    .replace(/\s+/g, ' ') // collapse repeated whitespace
    .replace(/^\s+|\s+$/, ''); // remove leading/trailing whitespace
};

export const Table = ({ items = false, fields = false, sortable = false }) => {
  const $Table = React.forwardRef(
    (
      {
        bsPrefix,
        className,
        striped,
        bordered,
        borderless,
        hover,
        size,
        variant,
        responsive,
        ...props
      },
      ref,
    ) => {
      const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, 'table');
      const classes = classNames(
        className,
        decoratedBsPrefix,
        variant && `${decoratedBsPrefix}-${variant}`,
        size && `${decoratedBsPrefix}-${size}`,
        striped && `${decoratedBsPrefix}-striped`,
        bordered && `${decoratedBsPrefix}-bordered`,
        borderless && `${decoratedBsPrefix}-borderless`,
        hover && `${decoratedBsPrefix}-hover`,
      );
      let computedFields = fields && fields(props.fields);
      const sortState = useState(props.items);
      const initalSortState = useState({});
      if (items && sortState[0]) {
        props.children = items({
          $items: sortState[0],
          $fields: computedFields,
          $sortable: sortable && sortable(sortState, initalSortState),
        });
      }
      const table = <table {...props} className={classes} ref={ref} />;
      if (responsive) {
        let responsiveClass = `${decoratedBsPrefix}-responsive`;
        if (typeof responsive === 'string') {
          responsiveClass = `${responsiveClass}-${responsive}`;
        }

        return <div className={responsiveClass}>{table}</div>;
      }

      return table;
    },
  );

  $Table.propTypes = propTypes;
  return $Table;
};

export const fields = ($fields) =>
  $fields &&
  $fields.map((field) => {
    if (Object.prototype.toString.call(field) === '[object String]') {
      field = { key: field };
    }
    return {
      ...field,
      label: field.label || titleCase(field.key),
    };
  });
export const sortable = (sortState, shouldSortAtInit) => {
  return (key, direction) => {
    direction = shouldSortAtInit[0][key] || direction;
    sortState[1](
      [...sortState[0]].sort((a, b) => {
        let nameA = a[key].toUpperCase(); // ignore upper and lowercase
        let nameB = b[key].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return direction === 'desc' ? 1 : -1;
        }
        if (nameA > nameB) {
          return direction === 'desc' ? -1 : 1;
        }
        // names must be equal
        return 0;
      }),
    );
    shouldSortAtInit[1]({
      ...shouldSortAtInit[0],
      [key]: direction === 'desc' ? 'asc' : 'desc',
    });
  };
};
const getKeys = ($fields, $items) => {
  return (
    $fields ||
    Object.keys($items[0] || {}).map((key) => ({
      key,
      label: titleCase(key),
    }))
  );
};

export const items = ({ $items, $fields, $sortable }) => {
  $fields = getKeys($fields, $items);
  return [
    <thead key="1">
      <tr>
        {$fields.map((heading) => (
          <th
            key={heading.key}
            onClick={
              heading.sortable
                ? $sortable.bind(null, heading.key, heading.sortDirection)
                : null
            }
            className={heading.className}
          >
            {heading.label}
          </th>
        ))}
      </tr>
    </thead>,
    <tbody key="2">
      {$items.map((item, i) => (
        <tr key={i}>
          {$fields.map((field) => (
            <td className={item[field.key].className} key={field.key}>
              {item[field.key] || ''}
            </td>
          ))}
        </tr>
      ))}
    </tbody>,
  ];
};
