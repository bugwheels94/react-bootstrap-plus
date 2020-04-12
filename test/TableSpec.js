import React from 'react';
import { mount } from 'enzyme';

import Table from '../src/Table';

describe('Table', () => {
  it('Should be a table', () => {
    mount(<Table />).assertSingle('table.table');
  });

  it('Should have correct class when striped', () => {
    mount(<Table striped />).assertSingle('table.table-striped');
  });

  it('Should have correct class when hover', () => {
    mount(<Table hover />).assertSingle('table.table-hover');
  });

  it('Should have correct class when bordered', () => {
    mount(<Table bordered />).assertSingle('table.table-bordered');
  });

  it('Should have correct class when borderless', () => {
    mount(<Table borderless />).assertSingle('table.table-borderless');
  });

  it('Should have correct class when small', () => {
    mount(<Table size="sm" />).assertSingle('table.table-sm');
  });

  it('Should have correct class when dark', () => {
    mount(<Table variant="dark" />).assertSingle('table.table-dark');
  });

  it('Should have responsive wrapper', () => {
    mount(<Table responsive />).assertSingle('div.table-responsive > .table');
  });

  it('Should have responsive breakpoints', () => {
    mount(<Table responsive="sm" />).assertSingle(
      'div.table-responsive-sm > .table',
    );
  });
  it('Should have items as array', () => {
    const wrapper = mount(
      <Table
        fields={['pokemonMania', 'name']}
        items={[
          { name: 'ankit', pokemonMania: 'September' },
          { name: 'bugwheels94', pokemonMania: 'August' },
        ]}
      />,
    );
    expect(wrapper.find('tr')).to.have.lengthOf(3);
    expect(wrapper.find('th').first().html()).to.equal(
      '<th>Pokemon Mania</th>',
    );
  });
  it('Should have items as array of object', () => {
    const wrapper = mount(
      <Table
        fields={[
          {
            key: 'pokemonMania',
            label: 'Pokemania',
          },
          { key: 'name' },
        ]}
        items={[
          { name: 'ankit', pokemonMania: 'September' },
          { name: 'bugwheels94', pokemonMania: 'August' },
        ]}
      />,
    );
    expect(wrapper.find('tr')).to.have.lengthOf(3);
    expect(wrapper.find('th').first().html()).to.equal('<th>Pokemania</th>');
  });
  it('check sorting with initial Direction Desc', () => {
    const wrapper = mount(
      <Table
        fields={[
          {
            key: 'pokemonMania',
            label: 'Pokemania',
            sortable: true,
            sortDirection: 'desc',
          },
          { key: 'name' },
        ]}
        items={[
          { name: 'bugwheels94', pokemonMania: 'August' },
          { name: 'ankit', pokemonMania: 'September' },
        ]}
      />,
    );
    wrapper.find('th').first().simulate('click');
    expect(wrapper.find('td').first().html()).to.equal('<td>September</td>');
    wrapper.find('th').first().simulate('click');
    expect(wrapper.find('td').first().html()).to.equal('<td>August</td>');
  });
  it('check sorting with initial Direction Asc', () => {
    const wrapper = mount(
      <Table
        fields={[
          {
            key: 'pokemonMania',
            label: 'Pokemania',
            sortable: true,
            sortDirection: 'asc',
          },
          { key: 'name' },
        ]}
        items={[
          { name: 'ankit', pokemonMania: 'September' },
          { name: 'bugwheels94', pokemonMania: 'August' },
        ]}
      />,
    );
    wrapper.find('th').first().simulate('click');
    expect(wrapper.find('td').first().html()).to.equal('<td>August</td>');
    wrapper.find('th').first().simulate('click');
    expect(wrapper.find('td').first().html()).to.equal('<td>September</td>');
  });
  it('check sorting with no initial Direction', () => {
    const wrapper = mount(
      <Table
        fields={[
          {
            key: 'pokemonMania',
            label: 'Pokemania',
            sortable: true,
          },
          { key: 'name' },
        ]}
        items={[
          { name: 'ankit', pokemonMania: 'September' },
          { name: 'bugwheels94', pokemonMania: 'August' },
        ]}
      />,
    );
    wrapper.find('th').first().simulate('click');
    expect(wrapper.find('td').first().html()).to.equal('<td>August</td>');
    wrapper.find('th').first().simulate('click');
    expect(wrapper.find('td').first().html()).to.equal('<td>September</td>');
  });
});
