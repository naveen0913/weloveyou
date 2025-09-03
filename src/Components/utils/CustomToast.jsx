import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Toast } from "primereact/toast";

const CustomToast = forwardRef((props, ref) => {
  const toastRef = useRef(null);
  // expose method to parent
  useImperativeHandle(ref, () => ({
    show: (options) => {
      toastRef.current.show(options);
    },
  }));

  return <Toast ref={toastRef} position={props.position || "top-right"} />;
});

export default CustomToast;
