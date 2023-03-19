import React, { memo, useState, useEffect, useRef, CSSProperties } from 'react';
import { useMount } from 'ahooks';
import styles from './index.module.scss';

interface DragSortProps {
  children: React.ReactNode;
  ids: number[];
  onOk?: Function;
  activeClassName?: string;
  // activeStyle?:CSSProperties
  newPositionClassName?: string;
}

function DragSort(props: DragSortProps) {
  const {
    children,
    ids,
    onOk,
    activeClassName = '',
    newPositionClassName = ''
  } = props;

  if (!children) {
    new Error('no children');
  }

  const data = useRef({
    rectList: [] as DOMRect[],
    isPointerDown: false,
    referenceElement: null as HTMLElement | null,
    lastPointerMove: {
      x: 0,
      y: 0
    },
    drag: {
      element: null as HTMLElement | null,
      index: 0,
      firstIndex: 0
    },
    clone: {
      element: null as HTMLElement | null,
      x: 0,
      y: 0
    },
    diff: {
      x: 0,
      y: 0
    }
  });
  const containerElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRectList();
    if (!containerElement.current) return;
    containerElement.current.addEventListener('pointerdown', onPointerDown);
    containerElement.current.addEventListener('pointermove', onPointerMove);
    containerElement.current.addEventListener('pointerup', onPointerUp);

    window.addEventListener('scroll', getRectList);
    window.addEventListener('resize', getRectList);
    window.addEventListener('orientationchange', getRectList);

    return () => {
      if (!containerElement.current) return;
      containerElement.current.removeEventListener(
        'pointerdown',
        onPointerDown
      );
      containerElement.current.removeEventListener(
        'pointermove',
        onPointerMove
      );
      containerElement.current.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const getRectList = () => {
    data.current.rectList.length = 0;
    if (!containerElement.current?.children) return;
    for (const item of containerElement.current.children) {
      data.current.rectList.push(item.getBoundingClientRect());
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }
    if (e.target === containerElement.current) {
      return;
    }
    if (!containerElement.current) {
      return;
    }

    data.current.isPointerDown = true;

    containerElement.current.setPointerCapture(e.pointerId);

    data.current.lastPointerMove.x = e.clientX;
    data.current.lastPointerMove.y = e.clientY;

    const node = e.target as HTMLElement;
    data.current.drag.element = node;

    const cloneNode = node.cloneNode(true) as HTMLElement;
    data.current.clone.element = cloneNode;
    node.classList.add(activeClassName);

    const index = Array.from(containerElement.current.children).indexOf(node);

    data.current.drag.index = index;
    data.current.drag.firstIndex = index;

    data.current.clone.x = data.current.rectList[index].left;
    data.current.clone.y = data.current.rectList[index].top;

    document.body.appendChild(cloneNode);

    cloneNode.style.transition = 'none';
    cloneNode.style.zIndex = '9999';
    cloneNode.classList.add(styles['clone-item']);
    cloneNode.style.transform =
      'translate3d(' +
      data.current.clone.x +
      'px, ' +
      data.current.clone.y +
      'px, 0)';

    for (const item of containerElement.current.children) {
      (item as HTMLElement).style.transition = 'transform 250ms';
    }
  };
  const onPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (data.current.isPointerDown) {
      data.current.diff.x = e.clientX - data.current.lastPointerMove.x;
      data.current.diff.y = e.clientY - data.current.lastPointerMove.y;

      data.current.lastPointerMove.x = e.clientX;
      data.current.lastPointerMove.y = e.clientY;

      data.current.clone.x += data.current.diff.x;
      data.current.clone.y += data.current.diff.y;

      data.current.clone.element!.style.transform =
        'translate3d(' +
        data.current.clone.x +
        'px, ' +
        data.current.clone.y +
        'px, 0)';
      const rectList = data.current.rectList;
      for (let i = 0; i < rectList.length; i++) {
        if (
          i !== data.current.drag.index &&
          e.clientX > rectList[i].left &&
          e.clientX < rectList[i].right &&
          e.clientY > rectList[i].top &&
          e.clientY < rectList[i].bottom
        ) {
          if (data.current.drag.index < i) {
            for (let j = data.current.drag.index; j < i; j++) {
              if (j < data.current.drag.firstIndex) {
                (
                  containerElement.current!.children[j] as HTMLElement
                ).style.transform = 'translate3d(0px, 0px, 0)';
              } else {
                const x = rectList[j].left - rectList[j + 1].left;
                const y = rectList[j].top - rectList[j + 1].top;
                (
                  containerElement.current!.children[j + 1] as HTMLElement
                ).style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
              }
            }
            data.current.referenceElement = containerElement.current!.children[
              i + 1
            ] as HTMLElement;
          } else if (data.current.drag.index > i) {
            for (let j = i; j < data.current.drag.index; j++) {
              if (data.current.drag.firstIndex <= j) {
                (
                  containerElement.current!.children[j + 1] as HTMLElement
                ).style.transform = 'translate3d(0px, 0px, 0)';
              } else {
                const x = rectList[j + 1].left - rectList[j].left;
                const y = rectList[j + 1].top - rectList[j].top;
                (
                  containerElement.current!.children[j] as HTMLElement
                ).style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
              }
            }
            data.current.referenceElement = containerElement.current!.children[
              i
            ] as HTMLElement;
          }
          const x =
            rectList[i].left - rectList[data.current.drag.firstIndex].left;
          const y =
            rectList[i].top - rectList[data.current.drag.firstIndex].top;
          (data.current.drag.element as HTMLElement).style.transform =
            'translate3d(' + x + 'px, ' + y + 'px, 0)';
          data.current.drag.index = i;
          break;
        }
      }
      if (data.current.drag.index !== data.current.drag.firstIndex) {
        data.current.drag.element!.classList.add(newPositionClassName);
      } else {
        data.current.drag.element!.classList.remove(newPositionClassName);
      }
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (data.current.isPointerDown) {
      data.current.isPointerDown = false;

      data.current.drag.element!.classList.remove(activeClassName);
      data.current.clone.element!.remove();

      for (const item of containerElement.current!.children) {
        (item as HTMLElement).style.transition = 'none';
        (item as HTMLElement).style.transform = 'translate3d(0px, 0px, 0px)';
      }

      if (data.current.referenceElement !== null) {
        containerElement.current!.insertBefore(
          data.current.drag.element!,
          data.current.referenceElement
        );
      }
      if (data.current.drag.element!.classList.contains(newPositionClassName)) {
        data.current.drag.element!.classList.remove(newPositionClassName);
      }
      // onOk();
    }
  };

  const getNodeIds = () => {
    const nodeIds: number[] = [];
    containerElement.current!.childNodes.forEach((v, i) => {
      //@ts-ignore
      nodeIds.push(v['data-id']);
    });
    return nodeIds;
  };

  return (
    <div ref={containerElement}>
      {React.Children.map(children, (v, i) => {
        return React.cloneElement(v as React.ReactElement, {
          dataId: ids[i]
          // style: { color: '#f00' }
        });
      })}
    </div>
  );
}

export default memo(DragSort);
