import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext); 
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [newBudget, setNewBudget] = useState(budget); // State for the new budget input

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setBudget(newBudget);
    setIsEditing(false);
  };

  return (
    <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
      {isEditing ? (
        <input
          type="number"
          value={newBudget}
          onChange={(e) => setNewBudget(Number(e.target.value))}
          className="form-control"
          style={{ maxWidth: "100px" }}
        />
      ) : (
        <div>Budget: ${budget}</div>
      )}
      <div>
        {isEditing ? (
          <button onClick={handleSaveClick} className="btn btn-primary btn-sm ms-2">
            Save
          </button>
        ) : (
          <button onClick={handleEditClick} className="btn btn-secondary btn-sm ms-2">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Budget;
