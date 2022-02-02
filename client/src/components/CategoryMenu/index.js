import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import { connect } from "react-redux";
import { updateCategories, updateCurrentCategory } from '../../redux/actions';

function CategoryMenu({ state, updateCategories, updateCurrentCategory }) {
  const { categories } = state;
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
      updateCategories(categoryData.categories);

      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        updateCategories(categories);
      });
    }
  }, [categoryData, loading, updateCategories]);

  const handleClick = id => {
    updateCurrentCategory(id);
  };

  return (
    <div>
    <h2>Choose a Category:</h2>
    {categories.map(item => (
      <button
        key={item._id}
        onClick={() => {
          handleClick(item._id);
        }}
      >
        {item.name}
      </button>
    ))}
  </div>
  );
}

const mapStateToProps = state => {
  return { state: state.ProductFilter };
};

export default connect(
  mapStateToProps,
  { updateCategories, updateCurrentCategory }
)(CategoryMenu);
