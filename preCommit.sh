pat='#[0-9]{1,5}-[A-Za-z]+';
message=`cat $1`
if [[ "$message" =~ $pat ]]; then 
  echo ""
else 
  echo "Always include the number of the issue you are working on with '#' on the beginning. Add a short description of what the commit is about. Use hyphens '-' as separators. E.g. '#456-project edit'. To skip this check use git commit -m \"skipping check\" --no-verify"
  exit 1;
fi 
