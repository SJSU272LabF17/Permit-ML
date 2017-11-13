/*
  You are given two STL iterators begin and end.
 
  Complete this template function that swaps neighboring elements
  of the range given by [begin, end). As always, you can assume that
  end is reachable from begin. 

  If the length of the range is odd, the last element is unchanged.
*/

template<typename I> void swap(I *begin, I *end)
{
   I temp;
   for (I *it = begin; it < end; it=it+2)
   {
      temp = *it;
      *it = *(it+1);
      *(it+1) = temp;
   }
   
}

int main()
{
   int a[] = { 1, 2, 3, 4, 5, 6 };
   swap(a, a + 6);
   print(a, 6);
   cout << “Expected: { 2 1 4 3 6 5 }” << endl;
   vector<string> words = { “Mary”, “had”, “a”, “little”, “lamb” };
   swap(words.begin(), words.end());
   print(words);
   cout << “Expected: { had Mary little a lamb }” << endl;
   list<double> numbers = { 1, 0.5, 0.25, 0.125 };
   swap(numbers.begin(), numbers.end());
   print(numbers);
   cout << “Expected: { 0.5 1 0.125 0.25 }” << endl;
   string name = “Wilma”;
   swap(name.begin(), name.end());
   cout << name << endl;
   cout << “Expected: iWmla” << endl;
   
   return 0;
}