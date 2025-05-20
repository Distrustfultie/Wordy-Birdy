/**
 * NoFriendsFound is a component that displays a message indicating 
 * that the user currently has no friends. It encourages the user 
 * to connect with language partners to begin practicing together.
 *
 * @returns {React.ReactElement} A JSX element representing the component.
 */

const NoFriendsFound = () => {
  return (
    <div className="card bg-base-200 p-6 text-center">
      <h3 className="font-semibold text-lg mb-2"> No Friends yet </h3>
      <p className="text-base-content opacity-70">
        Connect with Language parners below to start practicing together.
      </p>
    </div>
  );
}

export default NoFriendsFound;