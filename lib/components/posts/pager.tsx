import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import { NextRouter } from 'next/router';
import { Configs } from 'lib/utils';

type Prop = {
  router: NextRouter
  postCount: number
  tag?: string
  page?: number
}

const Pager: React.FC<Prop> = ({ router, postCount, tag, page }) => {

  const pageCount = Math.ceil(postCount / Configs.latestLimit)

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    if (tag !== undefined) {
      router.push(process.env.baseUrl + "/tags/" + tag + "/page/" + value)
      return
    }
    router.push(process.env.baseUrl + "/page/" + value)
  };

  if (page == undefined) {
    return <></>
  }

  return (
    <div className="mt-12">
      <Pagination defaultPage={page} count={pageCount} variant="outlined" shape="rounded" color="primary" onChange={handleChange}
      />
    </div>
  );
}

export default Pager