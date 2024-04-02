import React from 'react';
import { http } from '~/http';
import { debounce } from '~/utils/debounce';
import { Input } from '../Input/Input';
import { RadixPopover } from '../RadixPopover/RadixPopover';
import './SearchDropdown.scss';

export type SearchDropdownProps = {
  endpoint: string;
  onChange: (value: any) => void;
  paramater: string;
  renderEmpty?: () => React.ReactNode;
  renderMatch: (match: any) => React.ReactNode;
  trigger: React.ReactNode;
};

export const SearchDropdown = ({
  endpoint,
  onChange,
  paramater,
  renderEmpty,
  renderMatch,
  trigger,
}: SearchDropdownProps) => {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [matches, setMatches] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (popoverOpen && matches.length < 1) {
      getMatches(searchValue);
    }
  }, [popoverOpen]);

  const getMatches = React.useCallback(
    debounce((value: string) => {
      setLoading(true);
      http
        .get(endpoint, {
          params: {
            [paramater]: value,
          },
        })
        .then((matches) => {
          setMatches(matches.data.results);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300),
    [endpoint, paramater],
  );

  function renderMatches() {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (matches.length < 1) {
      if (renderEmpty) {
        return renderEmpty();
      }
      return null;
    }

    return (
      <ul className="SearchDropdown__matches">
        {matches.map((match) => (
          <li
            className="SearchDropdown__match"
            key={match.id}
            onClick={() => {
              onChange(match);
              setPopoverOpen(false);
            }}
          >
            {renderMatch(match)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <RadixPopover className="p-4" open={popoverOpen} onOpenChange={setPopoverOpen} trigger={trigger}>
      <Input
        autoFocus
        fluid
        id="search"
        label="Search"
        onChange={(e) => {
          setSearchValue(e.target.value);
          getMatches(e.target.value);
        }}
        value={searchValue}
      />
      {renderMatches()}
    </RadixPopover>
  );
};
