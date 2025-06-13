test('renders home page title', () => {
  render(<App />);
  const heading = screen.getByText(/Welcome to Our Group's Page/i);
  expect(heading).toBeInTheDocument();
});
