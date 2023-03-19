import React, { memo, useState, useRef, useEffect } from 'react';
import { useUpdateEffect } from 'ahooks';
import { observer } from 'mobx-react-lite';

import type { UserStore } from '@/store/UserStore';

function Test1({ userStore }: { userStore: UserStore }) {
  const user = {
    username: userStore.user.username,
    userId: userStore.user.id
  };
  useEffect(() => {
    if (user.username) {
      console.log('first', user);
    }
  }, [userStore.user.username]);
  return <div>test1</div>;
}
export default observer(Test1);
