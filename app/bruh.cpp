vector<uint8_t> idaStar(RubiksCube& cube)
{
  // Holds a copy of the cube, a move (L, R, etc.), and the search depth.
  struct Node
  {
    RubiksCube cube;
    uint8_t move;
    uint8_t depth;
  };

  // A stack of the visited nodes.
  stack<Node> nodeStack;
  // The current node in the search.
  Node curNode;
  // A list of the moves to get to the current node.  0xFF is used as a marker
  // to indicate the end of the list.
  array<uint8_t, 21> moves = {0xFF};
  // Flag that indicates when the cube is solved.
  bool solved = false;
  // The current search bound, which is a lower-bounds estimate of the number
  // of moves required to solve the cube.
  uint8_t bound;
  // The next bound if the cube is not solved at the current bound.  It will
  // hold the minimum estimated moves of all successor nodes greater than
  // bound.
  uint8_t nextBound = heuristic(cube);

  while (!solved)
  {
    // When there are no nodes in the stack, either this is the first iteration
    // of the search, or the current search bound is exhausted (i.e. it takes
    // more moves than "bound" to solve the cube).  Start a new search from the
    // scrambled cube (root) and move on to the next bound.
    if (nodeStack.empty())
    {
      // Start with the scrambled (root) node.  It's at depth 0, and no move is
      // required to get to it.
      nodeStack.push({cube, 0xFF, 0});

      // Set the new search bound, and nextBound to "infinity."
      bound     = nextBound;
      nextBound = 0xFF;
    }

    curNode = nodeStack.top();
    nodeStack.pop();

    // The move required to get to the new current node is appended to the
    // list, and the end-of-move marker is set.
    if (curNode.depth != 0)
      moves[curNode.depth - 1] = curNode.move;
    moves[curNode.depth] = 0xFF;

    // At the leaves of the search tree, check if the current node is the
    // solved cube.
    if (curNode.depth == bound)
    {
      if (curNode.cube.isSolved())
        solved = true;
    }
    else
    {
      // A priority queue is used to sort the successor nodes by estimated
      // moves.  That way the states that appear to be closest to solved are
      // visited first.
      struct PrioritizedMove
      {
        RubiksCube cube;
        uint8_t move;
        uint8_t estMoves; // Priority.  Least number of moves to most.
        bool operator>(const PrioritizedMove& rhs) const
        {
          return this->estMoves > rhs.estMoves;
        }
      };
      priority_queue<PrioritizedMove> successors;

      // Iterate over all 18 possible twists.
      for (uint8_t i = 0; i < 18; ++i)
      {
        // Some moves (redundant/commutative) can be pruned.
        if (curNode.depth == 0 || !prune(i, curNode.move))
        {
          // Copy the cube and move it to get to a successor state.
          RubiksCube cubeCopy(curNode.cube);
          cubeCopy.move(i);

          // Estimated moves to the solved state from the scrambled cube (root)
          // through this successor.
          uint8_t estSuccMoves = curNode.depth + 1 + heuristic(cubeCopy);

          if (estSuccMoves <= bound)
          {
            // If this successor state is estimated to take fewer moves than
            // the current bound, push it; otherwise, it's pruned (moving away
            // from the solved state).
            successors.push({cubeCopy, i, estSuccMoves});
          }
          else if (estSuccMoves < nextBound)
          {
            // The next search bound is the minimum of all successor node move
            // estimates that's greater than the current bound.
            nextBound = estSuccMoves;
          }
        }
      }

      while (!successors.empty())
      {
        // Push the nodes in sorted order.
        nodeStack.push({
          successors.top().cube,
          successors.top().move,
          curNode.depth + 1
        });

        successors.pop();
      }
    }
  }

  return moves;
}