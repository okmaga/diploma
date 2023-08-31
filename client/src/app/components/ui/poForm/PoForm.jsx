import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./poForm.scss";
import TextField from "../../common/form/TextField";
import { validator } from "../../../utils/validator";
import { LoadingButton } from "@mui/lab";
import SelectField from "../../common/form/SelectField";
import { useToaster } from "../../../hooks/useToaster";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../../store/authSlice";
import {
  createPurchaseOrder,
  getPurchaseOrderError,
  updatePurchaseOrder
} from "../../../store/purchaseOrdersSlice";

const PoForm = ({ mode = "new", poData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector(getCurrentUser());
  const dispatch = useDispatch();
  const storeError = useSelector(getPurchaseOrderError());
  const { toast } = useToaster();
  const navigate = useNavigate();
  const [data, setData] = useState({
    _id: poData?._id,
    title: poData?.title || "",
    description: poData?.description || "",
    requestor: poData?.requestor || currentUser?._id,
    costCenter: poData?.costCenter || "",
    budget: "General costs",
    amount: poData?.amount || "",
    status: "Pending"
  });

  useEffect(() => {
    if (storeError) {
      Object.keys(storeError).map(key => toast.error(storeError[key]));
    };
  }, [storeError]);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const costCenters = [
    { label: "HR", value: "HR" },
    { label: "Building Maintenance", value: "Building Maintenance" },
    { label: "Aquatics", value: "Aquatics" },
    { label: "OOL", value: "OOL" }
  ];

  const validatorConfig = {
    title: {
      isRequired: { message: "enter a title" },
      max: { value: 40, message: "too long – 40 characters max !" }
    },
    costCenter: {
      isRequired: { message: "select a cost center" }
    },
    amount: {
      isRequired: { message: "enter amount" },
      numbersOnly: { message: "only digits, no commas, spaces or dots" }
    }
  };
  useEffect(() => {
    const isValid = validate();
    setIsSubmitDisabled(!isValid);
  }, [data]);

  const validate = () => {
    const formErrors = validator(data, validatorConfig);
    setFormErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isValid = validate();
    if (!isValid) return;
    if (mode === "new") {
      dispatch(createPurchaseOrder(data))
        .unwrap()
        .then(() => {
          navigate("/purchase-orders");
          toast.success("Successfully sent");
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      try {
        await dispatch(updatePurchaseOrder(data));
        navigate("/purchase-orders");
        toast.success(`Successfully updated`);
      } catch (error) {
        setFormErrors(error);
        Object.keys(error).map(key => toast.error(error[key]));
        setIsLoading(false);
      }
    };
  };
  const handleChange = (target) => {
    setData(prev => ({
      ...prev,
      [target.name]: target.name === "amount"
        ? isNaN(Number(target.value))
          ? 0
          : Number(target.value)
        : target.value
    }));
  };

  return (
    <div className="po-form">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <TextField
              label="Title"
              name="title"
              value={data.title}
              onChange={handleChange}
              error={formErrors?.title}
            />
          </div>
          <div className="input-container">
            <TextField
              label="Amount"
              name="amount"
              value={data.amount}
              onChange={handleChange}
              error={formErrors?.amount}
            />
          </div>
          <div className="input-container">
            <TextField
              multiline
              rows={4}
              label="Description"
              name="description"
              value={data.description}
              onChange={handleChange}
              error={formErrors?.description}
            />
          </div>

          <div className="input-container">
            <SelectField
              label="Cost center"
              name="costCenter"
              onChange={handleChange}
              error={formErrors.costCenter}
              options={costCenters}
              value={data.costCenter}
              defaultValue=""
            />
          </div>
          <LoadingButton
            type="submit"
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitDisabled}
            loading={isLoading}
            loadingPosition="center"
          >{"Submit"}</LoadingButton>
        </form>
      </div>
    </div>
  );
};

PoForm.propTypes = {
  mode: PropTypes.string,
  poData: PropTypes.object
};

export default PoForm;
