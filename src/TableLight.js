import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RBTable from 'react-bootstrap/Table';

const propTypes = {
  fields: PropTypes.array,
  items: PropTypes.array,
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
  const TablePlus = React.forwardRef((props, ref) => {
    const sortState = useState(props.items),
      initalSortState = useState({}),
      propsPlus = {};
    if (items && sortState[0]) {
      propsPlus.children = items({
        $items: sortState[0],
        $fields: fields && fields(props.fields),
        $sortable: sortable && sortable(sortState, initalSortState),
      });
    }
    return <RBTable {...props} {...propsPlus} ref={ref} />;
  });

  TablePlus.propTypes = propTypes;
  return TablePlus;
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
