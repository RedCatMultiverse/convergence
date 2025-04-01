// .eslintrc.js
module.exports = {
    extends: [
      'next',
      'next/core-web-vitals'
    ],
    rules: {
      quotes: 'off',
      'react/no-unescaped-entities': 'off',
      'react/jsx-no-comment-textnodes': 'off',
      'react-hooks/exhaustive-deps': 'off'  // This will suppress the useEffect dependency warnings
    },
  };